import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { createBlogPost, getBlogPost, updateBlogPost } from '../../services/blogService';
import { pink } from '@mui/material/colors';
import { auth } from '../../firebase.config';

const BlogEditor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const fetchBlog = async () => {
        try {
          const blog = await getBlogPost(id);
          if (blog.authorId !== auth.currentUser?.uid) {
            navigate('/blogs');
            return;
          }
          setTitle(blog.title);
          setContent(blog.content);
        } catch (error) {
          setError('Failed to fetch blog post');
          console.error(error);
        }
      };
      fetchBlog();
    }
  }, [id, isEditing, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!title.trim() || !content.trim()) {
        throw new Error('Title and content are required');
      }

      if (isEditing) {
        await updateBlogPost(id, { title, content });
      } else {
        await createBlogPost(title, content);
      }
      navigate('/blogs');
    } catch (error) {
      setError(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: '800px',
        margin: '0 auto',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
        {isEditing ? 'Edit Blog' : 'Create Blog'}
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        required
        variant="outlined"
        disabled={isLoading}
      />

      <TextField
        label="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        fullWidth
        required
        multiline
        rows={12}
        variant="outlined"
        disabled={isLoading}
        sx={{
          '& .MuiOutlinedInput-root': {
            fontFamily: 'inherit',
          },
        }}
      />

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/blogs')}
          disabled={isLoading}
          sx={{ textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{
            bgcolor: pink[500],
            '&:hover': { bgcolor: pink[700] },
            textTransform: 'none',
          }}
        >
          {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Publish'}
        </Button>
      </Box>
    </Box>
  );
};

export default BlogEditor; 