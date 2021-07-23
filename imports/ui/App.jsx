import React from 'react';
import { DiscussionForm } from "./components/DiscussionForm";
import 'bootstrap/dist/css/bootstrap.css';
import { useTracker } from 'meteor/react-meteor-data';
import { DiscussionCollection } from "/imports/api/discussion";


export const App = () => {
  const discussions = [];
  const discussion = useTracker(() => DiscussionCollection.find({}).forEach(d => {
    discussions.push(<DiscussionForm discussion={d} />)
  }));

  if (discussions.length > 0) {
    return (
      <div>
        {discussions[0]}
      </div>
    )
  } else {
    return (
      <h1>Loading results ...</h1>
    );
  }
};
