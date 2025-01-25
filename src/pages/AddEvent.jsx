import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';
import { getDownloadURL, uploadBytes, ref, storage } from '../Firebase';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AddEvent() {
  const { loading } = useContext(UserContext);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const isEdit = queryParams.get('isEdit') === 'true';

  const event = location.state?.event || {};

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    owner: user.name || "",
    title: event.title || "",
    optional: event.optional || "",
    description: event.description || "",
    organizedBy: event.organizedBy || "",
    eventDate: formatDate(event.eventDate) || "",
    eventTime: event.eventTime || "",
    location: event.location || "",
    ticketPrice: event.ticketPrice || 0,
    image: event.image || '',
    likes: event.likes || 0,
    organizerEmail: user?.email || ""
  });

  const [isUploading, setIsUploading] = useState(false); // State to track loading

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `event-management/event-images/${file.name}`);
      console.log("Uploading file...", file.name);
      setIsUploading(true); // Set loading state to true
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        setFormData((prev) => ({ ...prev, image: url }));
        console.log("File uploaded successfully! Image URL: ", url);
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setIsUploading(false); // Reset loading state
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const navigationAfterSubmit = () => {
    if(isEdit) {
      if(user.role === 'admin') {
        navigate('/allevents');
      }
      else {
        navigate('/events');
      }
    }
    else {
      navigate('/');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiEndpoint = isEdit ? `/updateEvent/${event._id}` : "/createEvent";
    axios
      .post(apiEndpoint, formData)
      .then((response) => {
        console.log("Event posted successfully:", response.data);
        alert("Event posted successfully!");
        setFormData({
          owner: user.name,
          organizerEmail: user.email,
          title: "",
          optional: "",
          description: "",
          organizedBy: "",
          eventDate: "",
          eventTime: "",
          location: "",
          ticketPrice: 0,
          image: '',
          likes: 0
        });
        navigate();
      })
      .catch((error) => {
        console.error("Error posting event:", error);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>Please log in to post an event.</p>;
  }

  return (
    <div className='flex flex-col ml-20 mt-10'>
      <div><h1 className='font-bold text-[36px] mb-5'>{isEdit ? "Edit Event" : "Post an Event"}</h1></div>

      <form onSubmit={handleSubmit} className='flex flex-col w-[50%]'>
        <div className='flex flex-col gap-5'>
          <label className='flex flex-col'>
            Title:
            <input
              type="text"
              name="title"
              required
              className='rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none '
              value={formData.title}
              onChange={handleChange}
            />
          </label>
          <label className='flex flex-col'>
            Description:
            <textarea
              name="description"
              required
              className='rounded mt-2 pl-5 px-4 py-2 ring-sky-700 ring-2 h-8 border-none'
              value={formData.description}
              onChange={handleChange}
            />
          </label>
          <label className='flex flex-col'>
            Organized By:
            <input
              type="text"
              required
              className='rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none'
              name="organizedBy"
              value={formData.organizedBy}
              onChange={handleChange}
            />
          </label>
          <label className='flex flex-col'>
            Event Date:
            <input
              type="date"
              required
              className='rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none'
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
            />
          </label>
          <label className='flex flex-col'>
            Event Time:
            <input
              type="time"
              required
              name="eventTime"
              className='rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none'
              value={formData.eventTime}
              onChange={handleChange}
            />
          </label>
          <label className='flex flex-col'>
            Location:
            <input
              type="text"
              required
              name="location"
              className='rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none'
              value={formData.location}
              onChange={handleChange}
            />
          </label>
          <label className='flex flex-col'>
            Ticket Price:
            <input
              type="number"
              required
              name="ticketPrice"
              className='rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none'
              value={formData.ticketPrice}
              onChange={handleChange}
            />
          </label>
          <label className='flex flex-col'>
            Image:
            <input
              type="file"
              name="image"
              className='rounded mt-2 pl-5 px-4 py-10 ring-sky-700 ring-2 h-8 border-none'
              onChange={handleImageUpload}
            />
            {isUploading && <p>Uploading image...</p>}
            {formData.image && (
              <img src={formData.image} alt="Uploaded" className="w-32 h-32 mt-2 rounded" />
            )}
          </label>
          <button className='primary' type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}
