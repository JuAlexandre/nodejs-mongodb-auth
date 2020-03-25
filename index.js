const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, error => {
  if (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
  console.log(`Server is listening on ${PORT}`);
});
