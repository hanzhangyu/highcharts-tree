export default {
  id: 1,
  content: { title: "title 1 long long long long long long long" },
  children: [
    {
      id: 2,
      content: { title: "title 2", data: ["data"] },
      children: [
        {
          id: 4,
          content: {
            title: "title 4",
            data: ["data"]
          }
        },
        {
          id: 5,
          content: { title: "title 5", data: ["data"] }
        }
      ]
    },
    {
      id: 11,
      content: {
        title: "title 11",
        data: ["data"]
      },
    },
    {
      id: 3,
      content: {
        title: "title 3",
        data: ["data"]
      },
      children: [
        {
          id: 6,
          content: {
            title: "title 6",
            data: ["data", "data"]
          },
          children: [
            {
              id: 8,
              content: {
                title: "title 8",
                data: ["data", "data"]
              }
            },
            {
              id: 9,
              content: {
                title: "title 9",
                data: ["data"]
              }
            }
          ]
        },
        {
          id: 7,
          content: {
            title: "title 7",
            data: ["data"]
          },
          children: [
            {
              id: 10,
              content: {
                title: "title 10",
                data: ["data", "data"]
              }
            }
          ]
        }
      ]
    }
  ]
};
