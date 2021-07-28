import { check } from 'meteor/check';
import { DiscussionCollection } from "../db/discussion";

Meteor.methods({

    'addComment'(id, newcomment) {
        check(id, String);
        check(newcomment, Object);

        DiscussionCollection.update(
            { _id: id },
            { $push: { comments: newcomment } }
        );
    },

    'addDiscussion'(newDiscussion){
        check(newDiscussion, Object)

        DiscussionCollection.insert(newDiscussion);
    },

    'createuser'(email, password, name) {
        check(username, String);
        check(password, String);
        check(name, String);

        if (!Accounts.findUserByEmail(email)) {
            Accounts.createUser({
              email,
              password,
              profile: {
                name
              }
            });
          }
    }

});