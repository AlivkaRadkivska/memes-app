import { useState } from 'react';
import axios from 'axios';

const CreatePublicationForm = () => {
  const [form, setForm] = useState({
    pictures: [],
    description: '',
    status: 'active',
  });

  const [previewImages, setPreviewImages] = useState([]);

  const handleFileChange = (e: {
    target: { files: Iterable<unknown> | ArrayLike<unknown> };
  }) => {
    const files = Array.from(e.target.files);
    setForm((prevForm) => ({ ...prevForm, pictures: files }));

    // Generate image previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const formData = new FormData();
    form.pictures.forEach((file) => {
      formData.append('pictures', file);
    });
    formData.append('description', form.description);
    formData.append('status', form.status);

    try {
      const response = await axios.post(
        'http://localhost:3000/publication/',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      alert('Publication created successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error creating publication:', error);
      alert('Failed to create publication.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Pictures:
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          {previewImages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Preview ${index}`}
              width="100"
              height="100"
            />
          ))}
        </div>
      </div>

      <div>
        <label>
          Description:
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
          />
        </label>
      </div>

      <div>
        <label>
          Status:
          <select
            name="status"
            value={form.status}
            onChange={handleInputChange}
          >
            <option value="active">Active</option>
            <option value="hidden">Hidden</option>
            <option value="draft">Draft</option>
          </select>
        </label>
      </div>

      <button type="submit">Create Publication</button>
    </form>
  );
};

export default CreatePublicationForm;
