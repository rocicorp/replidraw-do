import { useEffect, useState } from 'react';
import Replicache from 'replicache';
import {Data} from '../frontend/data';
import {Designer} from '../frontend/designer';
import Pusher from 'pusher-js';

export default function Home() {
  const [data, setData] = useState<Data|null>(null);

  // TODO: Think through Replicache + SSR.
  useEffect(() => {
    if (data) {
      return;
    }

    const isProd = location.host.indexOf('.vercel.app') > -1;
    const rep = new Replicache({
      batchURL: '/api/replicache-push',
      clientViewURL: '/api/replicache-pull',
      diffServerURL: isProd ? 'https://serve.replicache.dev/pull' : 'http://localhost:7001/pull',
      diffServerAuth: isProd ? '1000000' : 'sandbox',
      wasmModule: '/replicache/replicache.wasm',
      syncInterval: null,
      useMemstore: true,
    });
    rep.sync();

    Pusher.logToConsole = true;
    var pusher = new Pusher('d9088b47d2371d532c4c', {
      cluster: 'us3'
    });
    var channel = pusher.subscribe('default');
    channel.bind('poke', function(data: unknown) {
      rep.sync();
    });

    setData(new Data(rep));
  });

  return data && <Designer {...{data}}/>;
}
