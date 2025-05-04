import fetch from "node-fetch";

async function test() {
  const res = await fetch("http://localhost:3000/api/burgers");
  const data = await res.json();
  console.log("Burgers:", data);
}

test();
