import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Form, FormGroup, Input, Label, Button, Alert } from 'reactstrap';
function AddDiscus({ cancelClicked, user }) {
    const [title, setTitle] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [body, setBody] = useState('');
    const [alert, setAlert] = useState(false);


    const submit = e => {
        e.preventDefault();

        if(title === '' || body === '') {
            setAlert(true);
            return;
        }

        const newDiscussion = {
            title,
            author: user.profile.name,
            authoremail: user.emails[0].address,
            createdAt: new Date(),
            body: body,
            comments: []
        };

        if (imgUrl) {
            newDiscussion.img_url = imgUrl;
        }

        Meteor.call('addDiscussion', newDiscussion)

        setTitle('');
        setImgUrl('');
        setBody('');
        cancelClicked();
    };

    return (
        <div className="add-discus">
            {
                alert ?
                    <Alert color="danger">
                        Title or Body is empty
                    </Alert>
                    :
                    ""
            }

            <p>Add New Discussion</p>
            <div>
                <Form onSubmit={submit}>
                    <FormGroup>
                        <Label >Title</Label>
                        <Input className="input-txt" type="text" required="" placeholder="The Title of The Discussion" value={title} onChange={e => setTitle(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label >Image URL (optional)</Label>
                        <Input type="text" required="" placeholder="The URL of The Discussion Image" value={imgUrl} onChange={e => setImgUrl(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label >Body</Label>
                        <textarea value={body} placeholder="Write something.." onChange={e => setBody(e.target.value)}></textarea>
                    </FormGroup>

                    <div className="form-group mb-0 text-center">
                        <Button color="primary" className="btn-block mt-2 me-lg-2" type="submit">Submit</Button>
                        <Button color="primary" className="btn-block mt-2 ms-md-2" onClick={cancelClicked}>Cancel</Button>
                    </div>
                </Form>
            </div>
        </div>

    );

}

export default AddDiscus
