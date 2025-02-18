import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getBlogPost, toggleLike } from '../../services/blogService';
import { pink } from '@mui/material/colors';
import { auth } from '../../firebase.config';

// Simple heart icon component
const HeartIcon = ({ filled }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogData = await getBlogPost(id);
        setBlog(blogData);
      } catch (error) {
        setError('Failed to fetch blog post');
        console.error(error);
      }
    };
    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    try {
      await toggleLike(id);
      setIsLiked(true);
      setBlog(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const isAuthor = auth.currentUser?.uid === blog.authorId;
  const formatDate = (timestamp) => {
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };

  return (
    <Box sx={{ maxWidth: '800px', margin: '0 auto', p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 2 }}>
          {blog.title}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {formatDate(blog.createdAt)}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isAuthor && (
              <Button
                variant="outlined"
                onClick={() => navigate(`/blogs/edit/${id}`)}
                sx={{ textTransform: 'none' }}
              >
                Edit
              </Button>
            )}
            <IconButton
              onClick={handleLike}
              disabled={isLiked}
              sx={{ color: isLiked ? pink[500] : 'inherit' }}
            >
              <HeartIcon filled={isLiked} />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {blog.likes || 0}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Typography
        variant="body1"
        sx={{
          whiteSpace: 'pre-wrap',
          lineHeight: 1.8,
          fontFamily: 'inherit',
        }}
      >
        {blog.content}
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Button
          variant="text"
          onClick={() => navigate('/blogs')}
          sx={{ textTransform: 'none' }}
        >
          ← Back to Blogs
        </Button>
      </Box>
    </Box>
  );
};

export default BlogDetail; 