const { test, expect } = require('@playwright/test');

test.describe('API CRUD operations for posts', () => {
  
  const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  // POST - Create new post
  test('POST - Successful creation of a new post', async ({ request }) => {
    const newPost = {
      title: "foo",
      body: "bar",
      userId: 1
    };

    const response = await request.post(apiUrl, {
      data: newPost
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('id');
    expect(responseBody.title).toBe(newPost.title);
    expect(responseBody.body).toBe(newPost.body);
    expect(responseBody.userId).toBe(newPost.userId);
  });

  // POST - Missing fields return 400 Bad Request(I can't find answer to this query request. I always recieve 201 Created)
  test('POST - Missing fields return 400 Bad Request', async ({ request }) => {
    const incompletePost = {
      //title: "$%%$&",
      // missing body and userId
    };

    const response = await request.post(apiUrl, {
      data: incompletePost
    });

    expect(response.status()).toBe(400);
  });

  // GET - Fetching all posts
  test('GET - Fetch all posts', async ({ request }) => {
    const response = await request.get(apiUrl);

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);
    expect(responseBody.length).toBeGreaterThan(0);
  });

  // GET - Fetch a specific post by ID
  test('GET - Fetch a specific post', async ({ request }) => {
    const postId = 1;
    const response = await request.get(`${apiUrl}/${postId}`);

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.id).toBe(postId);
  });

  // GET - Non-existent post returns 404
  test('GET - Non-existent post returns 404', async ({ request }) => {
    const postId = 9999; // Non-existent post
    const response = await request.get(`${apiUrl}/${postId}`);

    expect(response.status()).toBe(404);
  });

  // PUT - Update an existing post
  test('PUT - Update an existing post', async ({ request }) => {
    const postId = 1;
    const updatedPost = {
      title: "Updated title",
      body: "Updated body",
      userId: 1
    };

    const response = await request.put(`${apiUrl}/${postId}`, {
      data: updatedPost
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.id).toBe(postId);
    expect(responseBody.title).toBe(updatedPost.title);
    expect(responseBody.body).toBe(updatedPost.body);
  });

  // PUT - Non-existent post returns 404
  test('PUT - Non-existent post returns 404', async ({ request }) => {
    const postId = 9999; // Non-existent post
    const updatedPost = {
      title: "Updated title",
      body: "Updated body",
      userId: 1
    };

    const response = await request.put(`${"https://jsonplaceholder.typicode.com/"}/${postId}`, {
      data: updatedPost
    });

    expect(response.status()).toBe(404);
  });

  // DELETE - Delete a post
  test('DELETE - Delete a post successfully', async ({ request }) => {
    const postId = 1;

    const response = await request.delete(`${apiUrl}/${postId}`);

    expect(response.status()).toBe(200); // Or 204 for no content
  });

  // DELETE - Non-existent post returns 404
  test('DELETE - Non-existent post returns 404', async ({ request }) => {
    const postId = "9999"; // Non-existent post

    const response = await request.delete(`${"https://jsonplaceholder.typicode.com/"}/${postId}`);

    expect(response.status()).toBe(404);
  });
});
