const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongoosePaginateAggregate = require("mongoose-aggregate-paginate-v2");
const mongooseUniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

var userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    birthDate: {
        type: Date,
        min: "1900-01-01",
        max: Date.now(),
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    key: {
        type: String,
        required: true,
    },
    following: {
        type: [{ type: String }],
        default: [],
    },
    socialAccounts: {
        type: Array,
        default: [],
    },
    followers: {
        type: Number,
        default: 0,
    },
    banner: {
        type: String,
        default: "",
    },
    avatar: {
        type: String,
        default: "",
    },
    about: {
        type: String,
        maxlength: 200,
        default: function () {
            return `Hello world!, im ${this.userName}.`;
        },
        required: false,
    },
    activation: {
        isVerified: {
            type: Boolean,
            default: false,
        },
        key: {
            type: String,
            default: "",
        },
    },
    resetPassword: {
        key: {
            type: String,
            default: "",
        },
        expires: {
            type: Date,
            default: Date.now,
        },
    },
    streamData: {
        name: {
            type: String,
            required: true,
            default: function () {
                return this.userName;
            },
        },
        isLive: {
            type: Boolean,
            default: false,
        },
        languages: {
            type: String,
            required: true,
            enum: ["español", "english"],
            default: "english",
        },
        streamStartTime: {
            type: Date,
            default: Date.now,
        },
        title: {
            type: String,
            maxlength: 75,
            default: function () {
                return `It Was Me, ${this.userName}!`;
            },
        },
        color: {
            type: String,
            default: "#2ec5ce",
            validate: [
                (v) => (/^#([0-9a-f]{3}){1,2}$/i).test(v),
                "Invalid color hex.",
            ],
        },
        _category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            default: null,
        },
        tags: [
            {
                type: [
                    {
                        type: String,
                        maxlength: 10,
                    },
                ],
                validate: [
                    (val) => {
                        return val.length <= 5;
                    },
                    "Tags exceeds the limit of 5",
                ],
                default: [],
            },
        ],
        viewers: {
            type: Number,
            default: 0,
        },
    },
});

userSchema.plugin(mongoosePaginate);
userSchema.plugin(mongoosePaginateAggregate);
userSchema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model("User", userSchema);
