const User = require("../models/User.model");
const Category = require("../models/Category.model")

exports.viewStreamer = function (req, res, next) {
    let username = req.params.streamName;

    User.findOne({ userName: username }, function (err, user) {
        if (err) {
            return res.status(404).json({ message: "Server error." });
        }

        if (!user) {
            return res.status(404).send("User not found");
        }

        let streamer = {
            url: `${process.env.streamingUrl}/app/${user.key}.flv`,
            username: user.streamData.name,
            about: user.about,
            title: user.streamData.title,
            tags: user.streamData.tags,
            time: user.streamData.streamStartTime,
            category: user.streamData._category,
            followers: user.followers,
            //following: user.following,
            islive: user.streamData.isLive,
            color: user.streamData.color
        };

        return res.status(200).send(JSON.stringify(streamer));
    });
};
