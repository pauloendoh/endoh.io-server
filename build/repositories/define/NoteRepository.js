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
};
NoteRepository = __decorate([
    typeorm_1.EntityRepository(Note_1.Note)
], NoteRepository);
exports.default = NoteRepository;
