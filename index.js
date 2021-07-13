const fs = require("fs");
const randomEmail = require("random-email");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const names = require("./generatedRusNames.json");

function generateDateOfBirth() {
  const date = new Date(Math.random() * 1e12);
  const year = date.getFullYear() > 2000 ? 2000 : date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${day.toString().length === 1 ? "0" + day : day}.${
    month.toString().length === 1 ? "0" + month : month
  }.${year}`;
}

function generatePhoneNumber() {
  return `79${Math.round(Math.random() * 1e11)
    .toString()
    .slice(0, 9)}`;
}

function determineGender(fullName) {
  const patronymic = fullName.split(" ")[2];
  if (patronymic.endsWith("на")) return "female";
  return "male";
}

function createArrIds() {
  let arr = [1, 2];
  for (let i = 0; i < names.length - 2; i++) {
    arr.push(arr[i] + arr[i + 1]);
  }

  return arr;
}

const allIds = createArrIds();

class Client {
  constructor(name, id) {
    this["ФИО"] = name;
    this["Дата рождения"] = generateDateOfBirth();
    this["Телефон"] = generatePhoneNumber();
    this["Электронная почта"] = randomEmail({ domain: "example.com" });
    this["Пол"] = determineGender(name);
    this["Код клиента"] = id;
    this["Согласие на получение SMS"] = 0;
    this["Адрес"] = "";
    this["Заметка"] = "";
    this["Группа"] = "";
    this["Источник клиента"] = "";
    this["Статус в программе лояльности"] = "";
    this["Баланс счета клиента"] = 0;
    this["Баланс бонусного счета клиента"] = 0;
  }
}

const clients = names.map((name, index) => {
  return new Client(name, allIds[index]);
});

const jsonClients = JSON.stringify(clients);

fs.writeFile("db.json", jsonClients, "utf8", (err) => {
  if (err) throw err;

  const data = require("./db.json");

  const csvWriter = createCsvWriter({
    path: "file.csv",
    header: require("./headers.json"),
    fieldDelimiter: ";",
  });
  csvWriter.writeRecords(data).then(() => {
    console.log("...Done");
  });
});
