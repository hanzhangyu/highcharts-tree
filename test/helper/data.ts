export const dataForShift = {
  id: 1,
  content: { title: "title 1", data: ["data", "text"] },
  children: [
    {
      id: 2,
      content: { title: "title 2", data: ["data"] },
      children: [
        {
          id: 4,
          content: { title: "title 4", data: ["data"] },
          result: { x: 0, y: 2, width: 0 },
          children: [
            {
              id: 12,
              content: { title: "title 12", data: ["data"] },
              result: { x: 0, y: 3, width: 0 },
            }
          ]
        },
        {
          id: 5,
          content: { title: "title 5", data: ["data"] },
          result: { x: 1, y: 2, width: 1 }
        }
      ],
      result: { x: 0.5, y: 1, width: 1 }
    },
    {
      id: 11,
      content: { title: "title 11", data: ["data"] },
      result: { x: 1.625, y: 1, width: 1.625 }
    },
    {
      id: 3,
      content: { title: "title 3", data: ["data"] },
      children: [
        {
          id: 6,
          content: { title: "title 6", data: ["data", "data"] },
          children: [
            {
              id: 8,
              content: { title: "title 8", data: ["data", "data"] },
              result: { x: 1.5, y: 3, width: 1.5 }
            },
            {
              id: 9,
              content: { title: "title 9", data: ["data"] },
              result: { x: 2.5, y: 3, width: 2.5 }
            }
          ],
          result: { x: 2, y: 2, width: 2.5 }
        },
        {
          id: 7,
          content: { title: "title 7", data: ["data"] },
          children: [
            {
              id: 10,
              content: { title: "title 10", data: ["data", "data"] },
              result: { x: 3.5, y: 3, width: 3.5 }
            }
          ],
          result: { x: 3.5, y: 2, width: 3.5 }
        }
      ],
      result: { x: 2.75, y: 1, width: 3.5 }
    }
  ],
  result: { x: 1.625, y: 0, width: 3.5 }
};

export const dataForShiftOvermuch = {
  id: 1,
  content: { title: "title 1", data: ["data", "text"] },
  children: [
    {
      id: 2,
      content: { title: "title 2", data: ["data"] }
    },
    {
      id: 3,
      content: {
        title: "title 3",
        data: ["data"]
      },
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
        },
        {
          id: 6,
          content: {
            title: "title 6",
            data: ["data", "data"]
          }
        },
        {
          id: 7,
          content: {
            title: "title 7",
            data: ["data"]
          }
        }
      ]
    }
  ]
};
