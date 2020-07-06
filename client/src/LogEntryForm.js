import React, { useState } from 'react';
import { useForm} from 'react-hook-form';
import { createLogEntry} from './API';

const LogEntryForm = ({ location, onClose }) => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const onSubmit = async (data) => {
    setLoading(true);
    console.log(data);
    data.latitude = location.latitude;
    data.longitude = location.longitude;
    try {
    const logEntry = await createLogEntry(data);
    console.log(logEntry);
    onClose();
    }
    catch(error) {
        console.log(error);
        setError(error.message);
        setLoading(false);
    }
  }
  return( <form onSubmit={handleSubmit(onSubmit)} className="entry-form">
    { error ? <h3 className="error">{error}</h3> : null}
   <label for="title">Title</label>
   <input name="title"  required ref={register}/>
   <label for="comments">Comments</label>
   <textarea name="comments" rows={3} ref={register}></textarea>
   <label for="description">Description</label>
   <textarea name="description"  rows={3} ref={register}></textarea>
   <label for="image">Image</label>
   <input name="image" ref={register}/>
   <label for="visitDate">Visit Date</label>
   <input name="visitDate" type="date" required ref={register}/>
   <button disabled={loading}>{loading ? 'Loading...' : 'Create Log Entry'}</button>
  </form> 
  );
}

export default LogEntryForm;