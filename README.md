Local Streaming Server

This simple Node.js application serves as a local streaming server that allows you to view a list of available videos and stream them. The videos are stored in the "videos" folder, and the server provides a JSON response listing the available video names when you visit the root ("/") endpoint. Additionally, you can stream a specific video by accessing the "/:videoName" endpoint, where ":videoName" is the name of the video file (e.g., "/coke.mp4").


Getting Started

To use the local streaming server, follow these steps:

1. View Available Videos

    Visit the root endpoint to get a JSON response containing the names of available videos:
    https://local-streaming-server.vercel.app/

Example Response:
json:
    {
      "videoNames": ["coke.mp4", "pizza.mp4"]
    }

2. Stream a Video

   To stream a specific video, append the video name to the endpoint. For example, to stream "coke.mp4," visit:
   https://local-streaming-server.vercel.app/coke.mp4
   
   This will stream the "coke.mp4" video.


Videos Folder

The "videos" folder contains the following videos:
    coke.mp4
    pizza.mp4


Local Development

If you want to run the server locally, make sure you have Node.js and npm installed. Then, follow these steps:

Clone the repository:
git clone https://github.com/your-username/local-streaming-server.git

Navigate to the project directory:
cd local-streaming-server

Install dependencies:
npm install

Start the local server:
npm start
The server will be running at http://localhost:3000.


Deployed Instance

The application is deployed and accessible at:

https://local-streaming-server.vercel.app/

Feel free to explore the available videos and enjoy streaming them!

For any issues or questions, please contact.
