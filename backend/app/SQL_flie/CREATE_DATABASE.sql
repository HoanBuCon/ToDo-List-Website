CREATE DATABASE ToDoListDB;
USE ToDoListDB;

SHOW DATABASES;

CREATE TABLE Users (
	UserID int NOT NULL,
    UserName varchar(50) NOT NULL,
    Email varchar(255) NOT NULL,
    PasswordHash varchar(255) NOT NULL,
    RegisterTime datetime,
    LastUpdateTime datetime,
    LastLoginTime datetime,
    
    PRIMARY KEY (UserID)
);

CREATE TABLE ToDoList(
	ListID int NOT NULL,
    UserID int NOT NULL,
    Title varchar(255),
    ListDescription text,
    ListStatus varchar(20),
    StartTime datetime,
    EndTime datetime,
    TrueStartTime datetime,
    TrueEndTime datetime,
    
    PRIMARY KEY(ListID),
    FOREIGN KEY(UserID) REFERENCES Users(UserID)
);

CREATE TABLE Tasks(
	TaskID int NOT NULL,
    ListID int NOT NULL,
    Task_content TEXT NOT NULL,
    TaskStatus VARCHAR(20),
    CreateTime DATETIME,
    Complete_time DATETIME,
    
    PRIMARY KEY(TaskID),
    FOREIGN KEY(ListID) REFERENCES ToDoList(ListID)
);


SHOW TABLES;

DROP TABLE Users;
DROP TABLE ToDoList;
DROP TABLE Tasks;
