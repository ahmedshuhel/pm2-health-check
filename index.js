module.exports = function (app, opts) {
  app.get(opts.url || '/health', function (req, res) {
    var pm2 =  require('pm2');
    pm2.connect((err) =>  {
      if (err) { res.sendStatus(500); return; }
      pm2.list((err, processes) => {
        pm2.disconnect();
        if (err) { res.sendStatus(500); return; }
        var allOK;
        if (opts.optimistic) {
        	allOK = processes.every((process) => { return process.pm2_env.status === 'online'; });
        } else {
        	allOK = processes.some((process) => { return process.pm2_env.status === 'online'; });
        }
        res.sendStatus(allOK ? 200 : 500);
      });
    });
  });
};