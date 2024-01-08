const NodeMediaServer = require('node-media-server');
const User = require('../models/User.model');

class Rtmp {
    server;
    #config = {
        logType: 2,
        rtmp: {
            port: 1935,
            chunk_size: 60000,
            gop_cache: true,
            ping: 30,
            ping_timeout: 60
        },
        http: {
            port: 8888,
            enabled: false,
            admin: false,
            api: false,
            allow_origin: "*",
            mediaroot: './media/streamvideo',
        },
        /*https: {
            port: 8000,
            enabled: true,
            key: "./ssl/url/private.key",
            cert: "./ssl/url/certificate.crt",
            ca: "./ssl/url/ca_bundle.crt"
        },*/
        auth: {
            play: false,
            publish: false,
        },
        trans: {
            tasks: [
                {
                    app: 'live', // or other
                    hls: true,
                    hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                    dash: true,
                    dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
                    'websocket-flv': true,
                },
            ]
        }
        /*trans: {
            tasks: [
                {
                    app: 'live',
                    ac: 'aac',
                    vc: 'libx264',
                    hls: true,
                    hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                    dash: true,
                    dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
                }
            ]
        }*/
    };

    constructor() {
        this.server = new NodeMediaServer(this.#config);
        this.server.run();
        this.#configureStream();
    }

    #validStreamUrl(url) {
        const regex = /^(\/app{1})(\/)([\da-fA-F]{128})$/
        const regexstring = new RegExp(regex, "gim")
        return regexstring.test(url);
    }

    async #getUser(key) {
        return await User.findOne({ key: key });
    }

    #toggleIsLiveStream(key, isLive) {
        User.findOneAndUpdate({ key: key }, {
            $set: {
                "streamData.isLive": isLive
            }
        }, { new: true }, (err, user) => {
            if (err) {
                //console.log(err);
                return;
            }

            if (!user) {
                //console.log("User not found");
                return;
            }
        });
    }

    #rejectStream(idStream) {
        let session = this.server.getSession(idStream);
        session.reject();
    }

    #configureStream() {

        this.server.on('prePublish', (id, StreamPath, args) => {
            if (!this.#validStreamUrl(StreamPath))
                this.#rejectStream(id);

            let streamKey = StreamPath.split('/')[2];
            const { streamData } = this.#getUser(streamKey);

            if (streamData?.isLive)
                this.#rejectStream(id);

            this.#toggleIsLiveStream(streamKey, true);
        });

        this.server.on('donePublish', (id, StreamPath, args) => {
            if (!this.#validStreamUrl(StreamPath))
                this.#rejectStream(id);

            let streamKey = StreamPath.split('/')[2];
            const { streamData } = this.#getUser(streamKey);

            if (!streamData?.isLive)
                this.#rejectStream(id);

            this.#toggleIsLiveStream(streamKey, false);
        });

        this.server.on('prePlay', (id, StreamPath, args) => {
            if (!this.#validStreamUrl(StreamPath))
                this.#rejectStream(id);
        });

        this.server.on('donePlay', (id, StreamPath, args) => {
            if (!this.#validStreamUrl(StreamPath))
                this.#rejectStream(id);
        });
    }
}

exports.Rtmp = Rtmp;