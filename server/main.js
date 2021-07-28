import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { DiscussionCollection } from "/imports/db/discussion";
import '/imports/api/discussionMethods';



const SEEDEMAIL = 'meteorite@example.com';
const SEED_PASSWORD = 'password';
const SEEDNAME = 'meteorite';

Meteor.startup(() => {

  if (!Accounts.findUserByEmail(SEEDEMAIL)) {
    Accounts.createUser({
      email: SEEDEMAIL,
      password: SEED_PASSWORD,
      profile: {
        name: SEEDNAME
      }
    });
  }
  const user = Accounts.findUserByEmail(SEEDEMAIL);


  if (DiscussionCollection.find().count() === 0) {
    const discussion_obj = {
      title: 'Welcome! We [Robots] are welcoming you',
      author: 'The Kind Robot',
      authoremail: SEEDEMAIL,
      createdAt: new Date(),
      img_url: `https://i.pinimg.com/originals/b5/ab/32/b5ab323baa04bd9903c0d140a41cc7fa.jpg`,
      body: 'This is a discussion system for robots, but because we are kind, we are let humans joining us. Please feel free to comment and disciss with us.',
      comments: [
        {
          id: new Mongo.ObjectID(),
          writer: 'Rahim May',
          writeremail: 'ammayaba@gmail.com',
          createdAt: new Date(),
          reply: "Cool! I'm the first human to join :)"
        }
      ]
    };

    DiscussionCollection.insert(discussion_obj);
  }
});
