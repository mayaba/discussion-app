import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { DiscussionCollection } from "/imports/api/discussion";
import { UsersCollection } from "/imports/api/appUsers";


function insertDiscussion(discussion_obj) {
  DiscussionCollection.insert({
    username: discussion_obj.username,
    name: discussion_obj.name,
    createdAt: new Date(),
    img_url: discussion_obj.img_url,
    body: discussion_obj.body,
    comments: discussion_obj.comments
  });
}

function insertUser(username) {
  UsersCollection.insert({
    username,
    name: 'Meteor JS',
    email: 'meteor@example.com'
  });
}

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

Meteor.startup(() => {

  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
    insertUser(SEED_USERNAME);
  }
  const user = Accounts.findUserByUsername(SEED_USERNAME);

  if (DiscussionCollection.find().count() === 0) {
    // creating a new discussion for testing
    const discussion_obj = {
      username: 'mayaba',
      name: 'Rahim Mayaba',
      img_url: 'images/timeline-1.png',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sed urna in justo euismod condimentum. Fusce placerat enim et odio molestie sagittis.',
      comments: [
        {
          id: new Mongo.ObjectID(),
          username: 'hemoo91',
          name: 'Jon Doe',
          createdAt: new Date(),
          body: 'we are doing dance and singing songs, please vote our post which is very good for all young peoples'
        }
      ]
    };

    insertDiscussion(discussion_obj);
  }
});
