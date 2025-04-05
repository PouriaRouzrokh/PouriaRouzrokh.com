# Media Workflow Guide for Blog Content

This guide provides instructions for managing media assets for the Pouria AI blog using Notion and Cloudinary.

## Setting Up Cloudinary

The website uses Cloudinary for image and video optimization. Here's how to organize your media:

1. Create the following folders in your Cloudinary account:

   - `/blog-images`: For all blog post images
   - `/portfolio-images`: For portfolio projects
   - `/profile-images`: For profile-related images

2. For blog images, use a consistent naming pattern:

   ```
   blog-images/[slug]/[image-name]
   ```

3. Upload presets:
   - Enable auto-tagging for better organization
   - Set quality to "auto" for automatic optimization
   - Use responsive breakpoints for key sizes (400px, 800px, 1200px)

## Adding Media to Notion Blog Posts

### Images

1. **Upload to Cloudinary**:

   - Upload your image to the appropriate folder in Cloudinary
   - Use descriptive names (e.g., `hero-image.jpg`, `diagram-1.jpg`)
   - Recommended size: 1200px width minimum

2. **Add to Notion**:

   - In your Notion blog post, use the `/image` block
   - Paste the Cloudinary URL
   - Add a descriptive caption for accessibility
   - Set the FeaturedImage property to the Cloudinary URL for the hero image

3. **Optimized Image Sizes**:
   - Hero/Featured images: 1200 x 630px (16:9 ratio)
   - In-content images: 800px width minimum
   - Thumbnails: 400px width

### Videos

1. **Upload to YouTube**:

   - Create a YouTube video with proper metadata
   - Set appropriate visibility (Public, Unlisted)

2. **Embed in Notion**:

   - Use the `/embed` block in Notion
   - Paste the YouTube URL (not the embed code)
   - Add a descriptive caption

3. **For GIFs**:
   - Convert GIFs to videos using Cloudinary
   - Upload as MP4 to Cloudinary
   - Set autoplay and loop settings
   - Use the `/embed` block with the Cloudinary video URL

### Code Blocks

1. Use Notion's native code blocks with syntax highlighting:

   - Use the `/code` block
   - Select the appropriate language
   - Use proper indentation for readability

2. For inline code, use the `code` formatting within a paragraph.

## Media Best Practices

1. **Image Optimization**:

   - Compress images before uploading to Cloudinary
   - Use WebP format where possible
   - Keep file sizes under 200KB for better performance

2. **Accessibility**:

   - Always add descriptive alt text to images
   - Use captions to provide context
   - Include transcripts for video content when possible

3. **Responsive Design**:
   - Test images on mobile and desktop
   - Use responsive sizes for optimal display
   - Avoid text embedded in images

## Portfolio Media Management

### Portfolio Images

1. **Upload to Cloudinary**:

   - Upload your portfolio project images to the `/portfolio-images` folder in Cloudinary
   - Use high-quality images (1200px width minimum) with 16:9 aspect ratio
   - Use descriptive filenames (e.g., `project-name-preview.jpg`)

2. **Add to JSON File**:
   - Update the appropriate JSON file in `public/content/portfolio/`
   - Set the `imageUrl` property to the Cloudinary URL

### Portfolio YouTube Videos

1. **Upload to YouTube**:

   - Create and upload a video demo of your project to YouTube
   - Set appropriate visibility (Public or Unlisted depending on project status)
   - Add comprehensive metadata (title, description, tags)
   - Ensure the video has a good thumbnail that represents the project

2. **Add to JSON File**:

   - Add the YouTube video URL to the `videoUrl` property in your portfolio JSON file
   - Format: `https://www.youtube.com/watch?v=VIDEO_ID`
   - The website will automatically extract the video ID and display it properly
   - A YouTube video icon will appear on the portfolio card indicating video content

3. **Best Practices**:
   - Always provide both an `imageUrl` and `videoUrl` when possible
   - Keep videos concise (2-5 minutes for demos)
   - Include voice narration or captions for accessibility
   - The first frame of the video should clearly represent the project

## Content Creation Checklist

Before publishing a blog post, ensure:

- [ ] Featured image is set (1200 x 630px)
- [ ] All images have appropriate alt text and captions
- [ ] Code blocks have the correct language specified
- [ ] Videos are properly embedded
- [ ] Media files are properly named and organized in Cloudinary
- [ ] All media loads correctly on both mobile and desktop
- [ ] Total page size is reasonable for fast loading (< 2MB ideal)

## Revalidation Process

When you update content in Notion:

1. The changes will automatically appear on the website within 1 hour due to ISR (Incremental Static Regeneration).

2. To force an immediate update, you can call the revalidation API endpoint:

   ```
   POST /api/revalidate?secret=YOUR_SECRET&path=/blog/[slug]
   ```

3. This can be automated with Zapier or n8n workflows that trigger when a Notion page is updated.

For any questions or assistance with media workflows, please contact the development team.
