const Keyword = (name, regex) => {
  return {
    name,
    regex: !regex ? new RegExp(`\\b${name}\\b`, "i") : regex
  };
};

const spaFrameworks = [
  Keyword("react"),
  Keyword("angular"),
  Keyword("vue"),
  Keyword("ember"), Keyword("preact"),
  Keyword("meteor"),
  Keyword("elm")
];

const databases = [
  Keyword("oracle"),
  Keyword("ms sql", /((ms|microsoft)-sql|(ms|microsoft) sql)|mssql/i),
  Keyword("ms access", /(ms|microsoft) access|(ms|microsoft)-access/i),
  Keyword("mysql"),
  Keyword("neo4j"),
  Keyword("redis"),
  Keyword("postgresql"),
  Keyword("mongodb"),
  Keyword("elasticsearch"),
  Keyword("mariadb"),
  Keyword("couchdb"),
  Keyword("arangodb"),
  Keyword("db2"),
  Keyword("sqlite")
];

const languages = [
  Keyword("java"),
  Keyword("c#", /c#|\.net/i),
  Keyword("python"),
  Keyword("golang"),
  Keyword("javascript"),
  Keyword("php"),
  Keyword("node"),
  Keyword("ruby"),
  Keyword("f#", /f#/i),
  Keyword("ocaml"),
  Keyword("closure"),
  Keyword("haskell"),
  Keyword("c++", /c\+\+/i),
  Keyword("c", /[,\/\s]c[,\/\s]/i),
  Keyword("r", /[,\/\s]r[,\/\s]/i),
  Keyword("scala"),
  Keyword("swift"),
  Keyword("rust"),
  Keyword("elixir"),
  Keyword("erlang"),
  Keyword("objective-c", /\bobjective-c|objective c\b/i),
  Keyword("kotlin")
];


const industries = {
  dataScience: [
    Keyword("data science"),
    Keyword("data driven"),
    Keyword("event data"),
    Keyword("Math", /\bMath|Mathematics\b/i),
  ],
  finance: [
    Keyword("finance"),
    Keyword("fintech"),
    Keyword("d")
  ],
  crypto: [
    Keyword("crypto", /crypto|cryptocurrency/i),
    Keyword("etherium"),
    Keyword("blockchain"),
    Keyword("bitcoin"),
  ],
  frontend: [
    Keyword("front-end", /\bfront-end|front end\b/i),
    Keyword("UX/UI", /\bUX\/UI|UI\/UX\b/i),
    Keyword("Animations"),
    Keyword("Design"),
    Keyword("SPA", /\bSPA|Single Page Application\b/i),
    Keyword("CSS"),
    Keyword("HTML"),
    Keyword("javascript"),
    Keyword("React", /\bReact|Vue|Angular\b/i),
    Keyword("svelte")
  ],
  backend: [
    Keyword("Kubernetes"),
    Keyword(".NET"),
    Keyword("microservices"),
    Keyword("django"),
    Keyword("server side", /\bserver side|server-side\b/i),
    Keyword("back-end", /\bback-end|backend\b/i),
    Keyword("AWS"),
    Keyword("EC2"),
    Keyword("Rails"),
    Keyword("Ruby"),
    Keyword("nodejs", /\bnode|nodejs|node-js\b/i),
    Keyword("Golang", /\bGolang|Go-lang\b/i),
    Keyword("Elixir"),
    Keyword("Clojure"),
    Keyword("Java"),
    Keyword("C#")
  ],
  gamedev: [
    Keyword("cpp", /\bcpp|c\+\+\b/i),
    Keyword("lua"),
    Keyword("gamedev", /\bgamedev|game-dev|game dev\b/i),
    Keyword("gaming"),
    Keyword("Unity"),
    Keyword("3d engine"),
  ]
}

const stackShare = spaFrameworks.concat(languages).concat(databases);

module.exports = {
  stackShare,
  industries
}
