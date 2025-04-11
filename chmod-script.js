
const { exec } = require('child_process');
exec('chmod +x setup.sh', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error making script executable: ${error}`);
    return;
  }
  console.log('Setup script is now executable');
});
