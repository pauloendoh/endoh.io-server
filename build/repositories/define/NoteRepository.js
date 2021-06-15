"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Note_1 = require("../../entities/define/Note");
let NoteRepository = class NoteRepository extends typeorm_1.Repository {
    async getAllNotesFromUserId(userId) {
        return this.createQueryBuilder("note")
            .where({ userId })
            .orderBy("note.docId", "ASC")
            .addOrderBy("note.index", "ASC")
            .getMany();
    }
    async isOwner(notes, userId) {
        const ids = notes.map((note) => note.id);
        const count = await this.createQueryBuilder("note")
            .where("note.id IN (:...ids)", { ids })
            .andWhere("note.userId = :userId", { userId })
            .getCount();
        return ids.length === count;
    }
    async createNotesForNewUser(user, doc) {
        const notes = [];
        notes.push(await this.save({
            user,
            doc,
            index: 0,
            description: `[Tip] You can create study notes here! Also, you can create flashcard questions to test yourself, but they are not obligatory like in other tools! \nTest Yourself!`,
        }));
        notes.push(await this.save({
            user,
            doc,
            index: 1,
            description: `All grown-ups were once children... but only few of them remember it.`,
            question: "What do the grown-ups forget?",
        }));
        notes.push(await this.save({
            user,
            doc,
            index: 2,
            description: `"I am looking for friends. What does that mean -- tame?"
      \n\n"It is an act too often neglected," said the fox. \n\n"It means to establish ties."
      
      \n\n"To establish ties?"
      
      \n\n"Just that," said the fox.
      \n\n"To me, you are still nothing more than a little boy who is just like a hundred thousand other little boys. And I have no need of you. And you, on your part, have no need of me. To you I am nothing more than a fox like a hundred thousand other foxes. But if you tame me, then we shall need each other. To me, you will be unique in all the world. To you, I shall be unique in all the world...."`,
            question: 'What means to "tame" ?',
        }));
        notes.push(await this.save({
            user,
            doc,
            index: 3,
            description: "“Well, I must endure the presence of a few caterpillars if I wish to become acquainted with the butterflies.”",
            question: "What must you endure to get butterflies?",
        }));
        return notes;
    }
};
NoteRepository = __decorate([
    typeorm_1.EntityRepository(Note_1.Note)
], NoteRepository);
exports.default = NoteRepository;
