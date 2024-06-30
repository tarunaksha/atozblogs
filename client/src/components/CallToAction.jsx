import { Button } from "flowbite-react";

const CallToAction = () => {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-lg">
          <strong>Want to learn more about javascript?</strong>
        </h2>
        <p className="text-gray-500 my-2">Check out these resorces</p>
        <Button
          gradientDuoTone="greenToBlue"
          className="rounded-tl-xl rounded-bl-none"
        >
          <a
            href="https://www.google.com/search?q=js+resources&rlz=1C1OPNX_enIN1104IN1104&oq=js+resour&gs_lcrp=EgZjaHJvbWUqBwgBEAAYgAQyBggAEEUYOTIHCAEQABiABDINCAIQLhivARjHARiABDIICAMQABgWGB4yDAgEEAAYChgPGBYYHjIKCAUQABgPGBYYHjIKCAYQABgPGBYYHjIKCAcQABgPGBYYHjIICAgQABgWGB4yCAgJEAAYFhge0gEINzg4NmowajeoAgCwAgA&sourceid=chrome&ie=UTF-8"
            target="__blank"
            rel="noopener noreferrer"
          >
            Learn More
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX6TpqyajN7Qt38VNNuV_8K5qVjslJnk_fuQ&s" />
      </div>
    </div>
  );
};

export default CallToAction;
