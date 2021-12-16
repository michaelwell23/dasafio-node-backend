import app from './app';
const port = process.env.PORT;

app.listen(port, function () {
  console.log(`Server running at http://localhost:${port}`);
});
