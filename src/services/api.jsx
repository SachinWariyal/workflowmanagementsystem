import axios from "axios";

// export async function fetchWorkflows() {
//   const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
//   return res.data.slice(0, 10).map((item, idx) => ({
//     id: "#" + (idx + 100),
//     name: "Workflow Name " + idx,
//     lastEditedOn: "Zubin Khanna | 22:43 IST - 28/05",
//     description: item.title,
//     starred: idx % 2 === 0
//   }));
// }

// services/api.js
export const fetchWorkflows = async () => {
  const data = localStorage.getItem("my_workflows");
  return data ? JSON.parse(data) : [];
};