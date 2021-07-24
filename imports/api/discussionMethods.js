import { check } from 'meteor/check';
import { DiscussionCollection } from "../db/discussion";

Meteor.methods({

    'discussion.update'(id, newcomment) {
        check(id, String);
        check(newcomment, Object);

        if(!newcomment.username) {
            throw new Meteor.Error('Not authorized.');
        }

        DiscussionCollection.update(
            { _id: id },
            { $push: { comments: newcomment } }
        );
    }

});