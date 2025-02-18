import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Paper, Tab, Tabs, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { createBlogPost, getBlogPost, updateBlogPost } from '../../services/blogService';
import { pink } from '@mui/material/colors';
import { auth } from '../../firebase.config';
import { Editor } from '@tinymce/tinymce-react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PreviewIcon from '@mui/icons-material/Preview';
import EditIcon from '@mui/icons-material/Edit';

const BlogEditor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState(0); // 0 for edit, 1 for preview
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const fetchBlog = async () => {
        try {
          setIsLoading(true);
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
        } finally {
          setIsLoading(false);
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
      if (!title.trim()) {
        throw new Error('Title is required');
      }

      const editorContent = editorRef.current.getContent();
      if (!editorContent.trim()) {
        throw new Error('Content is required');
      }

      if (isEditing) {
        await updateBlogPost(id, { title, content: editorContent });
      } else {
        await createBlogPost(title, editorContent);
      }
      navigate('/blogs');
    } catch (error) {
      setError(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: pink[500] }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      p: { xs: 2, md: 4 },
      minHeight: '100vh',
      bgcolor: '#f8f9fa'
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4,
        gap: 2,
        bgcolor: 'white',
        p: 3,
        borderRadius: 3,
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
      }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/blogs')}
          sx={{
            color: pink[500],
            '&:hover': { bgcolor: pink[50] },
            textTransform: 'none',
          }}
        >
          Back to Blogs
        </Button>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            flex: 1,
            background: `linear-gradient(45deg, ${pink[700]}, ${pink[500]})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {isEditing ? 'Edit Blog' : 'Create Blog'}
        </Typography>
      </Box>

      {error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#ffebee', color: 'error.main' }}>
          <Typography>{error}</Typography>
        </Paper>
      )}

      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
          variant="outlined"
          disabled={isLoading}
          sx={{ mb: 3 }}
          InputProps={{
            sx: { 
              borderRadius: 2,
              fontSize: '1.25rem',
              '&.Mui-focused': {
                borderColor: pink[500],
              }
            }
          }}
        />

        <Tabs 
          value={tab} 
          onChange={(e, newValue) => setTab(newValue)}
          sx={{ 
            mb: 2,
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              minWidth: 100,
            },
            '& .Mui-selected': {
              color: pink[500],
            },
            '& .MuiTabs-indicator': {
              backgroundColor: pink[500],
            }
          }}
        >
          <Tab icon={<EditIcon />} label="Edit" />
          <Tab icon={<PreviewIcon />} label="Preview" />
        </Tabs>

        <Box sx={{ display: tab === 0 ? 'block' : 'none' }}>
          <Editor
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={content}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
                'codesample', 'paste'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | codesample | help',
              content_style: `
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                  font-size: 16px;
                  line-height: 1.8;
                  color: #2d3436;
                  padding: 1rem;
                }
                p { margin: 0 0 1em 0; }
                h1, h2, h3, h4, h5, h6 { 
                  color: #2d3436;
                  font-weight: 600;
                  line-height: 1.3;
                  margin: 1.5em 0 0.5em 0;
                }
                h1 { font-size: 2.5em; }
                h2 { font-size: 2em; }
                h3 { font-size: 1.75em; }
                h4 { font-size: 1.5em; }
                h5 { font-size: 1.25em; }
                h6 { font-size: 1.1em; }
                a { color: #e91e63; }
                blockquote {
                  margin: 1em 0;
                  padding: 0.5em 1em;
                  border-left: 4px solid #f8bbd0;
                  background-color: #fce4ec;
                }
                code {
                  background-color: #f5f5f5;
                  padding: 0.2em 0.4em;
                  border-radius: 3px;
                  font-size: 0.9em;
                  color: #e91e63;
                }
                pre {
                  background-color: #2d3436;
                  color: #fff;
                  padding: 1em;
                  border-radius: 4px;
                  overflow-x: auto;
                }
                img {
                  max-width: 100%;
                  height: auto;
                  border-radius: 4px;
                }
                ul, ol {
                  padding-left: 2em;
                  margin: 0 0 1em 0;
                }
                li {
                  margin-bottom: 0.5em;
                }
                ul li {
                  list-style-type: disc;
                }
                ol li {
                  list-style-type: decimal;
                }
                ul ul, ol ol, ul ol, ol ul {
                  margin: 0.5em 0;
                }
              `,
              paste_as_text: false,
              paste_enable_default_filters: true,
              paste_word_valid_elements: "b,strong,i,em,h1,h2,h3,h4,h5,h6,p,ul,ol,li",
              paste_retain_style_properties: "none",
              lists_indent_on_tab: true,
              forced_root_block: 'p',
              remove_trailing_brs: false,
              browser_spellcheck: true,
              contextmenu: "link image table",
              valid_elements: '*[*]',
              valid_children: '+body[style],+li[p],+p',
              extended_valid_elements: 'li[class|style],ul[class|style],ol[class|style],p,span[*]',
              custom_elements: '~li,~ul,~ol',
              force_br_newlines: false,
              force_p_newlines: true,
              keep_styles: true,
              entity_encoding: 'raw',
              cleanup: false,
              cleanup_on_startup: false,
              convert_urls: false,
              relative_urls: false,
              remove_script_host: true,
              end_container_on_empty_block: true,
              indent: true,
              indent_use_margin: false,
              indent_margin: false,
              advlist_bullet_styles: 'disc,circle,square',
              advlist_number_styles: 'default,lower-alpha,lower-roman,upper-alpha,upper-roman',
            }}
          />
        </Box>

        <Box 
          sx={{ 
            display: tab === 1 ? 'block' : 'none',
            minHeight: '500px',
            p: 3,
            bgcolor: '#fff',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 2,
              my: 2
            },
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              color: '#2d3436',
              fontWeight: 600,
              lineHeight: 1.3,
              mt: 4,
              mb: 2,
              '&:first-child': {
                mt: 0
              }
            },
            '& h1': { fontSize: '2.5rem' },
            '& h2': { fontSize: '2rem' },
            '& h3': { fontSize: '1.75rem' },
            '& h4': { fontSize: '1.5rem' },
            '& h5': { fontSize: '1.25rem' },
            '& h6': { fontSize: '1.1rem' },
            '& p': {
              mb: 2,
              lineHeight: 1.8,
              fontSize: '1.1rem',
              color: '#2d3436'
            },
            '& a': {
              color: pink[500],
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            },
            '& ul, & ol': {
              mb: 2,
              pl: 4,
              '& li': {
                mb: 1,
                lineHeight: 1.7
              }
            },
            '& blockquote': {
              borderLeft: `4px solid ${pink[200]}`,
              m: 0,
              mb: 2,
              pl: 3,
              py: 1,
              bgcolor: pink[50],
              borderRadius: '0 4px 4px 0',
              '& p': {
                m: 0
              }
            },
            '& pre': {
              mb: 2,
              borderRadius: 2,
              overflow: 'auto',
              bgcolor: '#2d3436',
              color: '#fff',
              p: 2
            },
            '& code': {
              fontFamily: 'monospace',
              p: 0.5,
              borderRadius: 1,
              bgcolor: '#f5f5f5',
              color: pink[700],
              fontSize: '0.9em'
            },
            '& table': {
              width: '100%',
              mb: 2,
              borderCollapse: 'collapse',
              '& th, & td': {
                border: '1px solid #ddd',
                p: 1.5
              },
              '& th': {
                bgcolor: pink[50]
              },
              '& tr:nth-of-type(even)': {
                bgcolor: '#f8f9fa'
              }
            },
            '& hr': {
              my: 3,
              border: 'none',
              borderTop: `1px solid ${pink[100]}`
            },
            '& p:empty, & p:only-child:not(:has(*))': {
              display: 'none'
            }
          }}
          dangerouslySetInnerHTML={{ 
            __html: editorRef.current ? editorRef.current.getContent() : '' 
          }}
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/blogs')}
            disabled={isLoading}
            sx={{ 
              textTransform: 'none',
              borderColor: pink[200],
              color: pink[700],
              '&:hover': {
                borderColor: pink[500],
                bgcolor: pink[50]
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isLoading}
            sx={{
              bgcolor: pink[500],
              '&:hover': { bgcolor: pink[700] },
              textTransform: 'none',
              px: 4,
              py: 1,
              borderRadius: 2
            }}
          >
            {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Publish'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default BlogEditor; 