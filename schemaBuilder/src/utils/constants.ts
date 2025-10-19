export const defaultBlue = "#175e7a";
export const defaultNoteTheme = "#fcf7ac";
export const noteWidth = 180;
export const noteRadius = 3;
export const noteFold = 24;
export const darkBgTheme = "#16161A";
export const stringColor = "text-orange-500";
export const intColor = "text-yellow-500";
export const decimalColor = "text-lime-500";
export const booleanColor = "text-violet-500";
export const binaryColor = "text-emerald-500";
export const enumSetColor = "text-sky-500";
export const documentColor = "text-indigo-500";
export const networkIdColor = "text-rose-500";
export const geometricColor = "text-fuchsia-500";
export const vectorColor = "text-slate-500";
export const otherColor = "text-zinc-500";
export const dateColor = "text-cyan-500";
export const tableHeaderHeight = 50;
export const tableWidth = 220;
export const gridSize = 24;
export const gridCircleRadius = 0.85;
export const tableFieldHeight = 36;
export const tableColorStripHeight = 7;
export const pngExportPixelRatio = 4;
export const minAreaSize = 120;

export const socials = {
  docs: "https://drawdb-io.github.io/docs",
  discord: "https://discord.gg/BrjZgNrmR6",
  twitter: "https://x.com/drawDB_",
  github: "https://github.com/drawdb-io/drawdb",
};

export const Cardinality = {
  ONE_TO_ONE: "one_to_one",
  ONE_TO_MANY: "one_to_many",
  MANY_TO_ONE: "many_to_one",
};

const xOffset = window.innerWidth * 0.65;
export const diagram = {
  tables: [
    {
      name: "users",
      x: xOffset + 75,
      y:
        window.innerHeight * 0.23 -
        (tableHeaderHeight + 5 * tableFieldHeight + tableColorStripHeight) *
          0.5,
      fields: [
        {
          name: "id",
          type: "INT PRIMARY KEY",
        },
        {
          name: "name",
          type: "VARCHAR",
        },
        {
          name: "email",
          type: "VARCHAR",
        },
        {
          name: "password",
          type: "VARCHAR",
        },
      ],
      color: "#3b82f6",
    },
    {
      id: 1,
      name: "orders",
      x: xOffset + 27,
      y:
        window.innerHeight * 0.72 -
        (tableHeaderHeight + 6 * tableFieldHeight + tableColorStripHeight) *
          0.5,
      fields: [
        {
          name: "id",
          type: "INT PRIMARY KEY",
        },
        {
          name: "user_id",
          type: "INT",
        },
        {
          name: "type",
          type: "ENUM",
        },
        {
          name: "price",
          type: "DECIMAL",
        },
        {
          name: "order_date",
          type: "TIMESTAMP",
        },
      ],
      color: "#10b981",
    },
    {
      id: 2,
      name: "payments",
      x: xOffset + 336,
      y:
        window.innerHeight * 0.72 -
        (tableHeaderHeight + 5 * tableFieldHeight + tableColorStripHeight) *
          0.5,
      fields: [
        {
          name: "id",
          type: "INT PRIMARY KEY",
        },
        {
          name: "order_id",
          type: "INT",
        },
        {
          name: "amount",
          type: "DECIMAL",
        },
        {
          name: "payment_date",
          type: "VARCHAR",
        },
        {
          name: "status",
          type: "ENUM",
        },
      ],
      color: "#8b5cf6",
    },
    {
      id: 3,
      name: "products",
      x: xOffset + 310,
      y:
        window.innerHeight * 0.23 -
        (tableHeaderHeight + 5 * tableFieldHeight + tableColorStripHeight) *
          0.5,
      fields: [
        {
          name: "id",
          type: "INT PRIMARY KEY",
        },
        {
          name: "name",
          type: "VARCHAR",
        },
        {
          name: "description",
          type: "TEXT",
        },
        {
          name: "price",
          type: "DECIMAL",
        },
        {
          name: "quantity",
          type: "INT",
        },
      ],
      color: "#f59e0b",
    },
  ],
  relationships: [
    {
      startTableId: 1,
      startFieldId: 1,
      endTableId: 0,
      endFieldId: 0,
      cardinality: "many_to_one",
    },
    {
      startTableId: 2,
      startFieldId: 1,
      endTableId: 1,
      endFieldId: 0,
      cardinality: "one_to_one",
    },
    {
      startTableId: 1,
      startFieldId: 2,
      endTableId: 3,
      endFieldId: 0,
      cardinality: "many_to_one",
    },
  ],
};
