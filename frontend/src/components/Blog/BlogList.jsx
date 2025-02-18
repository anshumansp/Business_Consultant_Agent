import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { subscribeToBlogPosts } from '../../services/blogService';
import { pink } from '@mui/material/colors';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeToBlogPosts(setBlogs);
    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };

  return (
    <Box sx={{ p: 3, maxWidth: '800px', margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Blogs
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/blogs/create')}
          sx={{
            bgcolor: pink[500],
            '&:hover': { bgcolor: pink[700] },
            textTransform: 'none',
          }}
        >
          Write a Blog
        </Button>
      </Box>

      {blogs.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No blogs available yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Be the first one to write a blog!
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {blogs.map((blog) => (
            <Card
              key={blog.id}
              sx={{
                cursor: 'pointer',
                '&:hover': { boxShadow: 3 },
                transition: 'box-shadow 0.2s',
              }}
              onClick={() => navigate(`/blogs/${blog.id}`)}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                  {blog.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {blog.content}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(blog.createdAt)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {blog.likes} likes
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default BlogList; 