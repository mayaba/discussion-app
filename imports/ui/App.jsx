import React from 'react';
import { DiscussionForm } from "./components/DiscussionForm";
import { useTracker } from 'meteor/react-meteor-data';
import { DiscussionCollection } from "/imports/api/discussion";
import { UsersCollection } from "/imports/api/appUsers";
import { LoginForm } from "./components/LoginForm";
import 'bootstrap/dist/css/bootstrap.css';


export const App = () => {
  const authUser = useTracker(() => Meteor.user());
  const discussions = [];

  useTracker(() => DiscussionCollection.find({}).forEach(d => {
    if(authUser) {
      // get the user from userscollection
      const userInfo = UsersCollection.findOne({username: authUser.username});
      discussions.push(<DiscussionForm key={d._id} discussion={d} user={userInfo} />)
    }
  }));

  return (
    <>
      {
        authUser ? (
          <>
            {discussions.length > 0 ? (
              <div>
                {discussions[0]}
              </div>
            ) : (
              <h1>Loading results ...</h1>
            )}
          </>
        ) : (
          <LoginForm />
      )
      }
    </>
  )
};
