"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Note = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../User");
const Doc_1 = require("./Doc");
let Note = class Note {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Note.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => User_1.User, (user) => user.docs, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", User_1.User)
], Note.prototype, "user", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Note.prototype, "userId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Doc_1.Doc, (doc) => doc.notes, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Doc_1.Doc)
], Note.prototype, "doc", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Note.prototype, "docId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Note.prototype, "index", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Note.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({ default: '' }),
    __metadata("design:type", String)
], Note.prototype, "question", void 0);
__decorate([
    typeorm_1.Column({ default: 1 }),
    __metadata("design:type", Number)
], Note.prototype, "weight", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", String)
], Note.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", String)
], Note.prototype, "updatedAt", void 0);
Note = __decorate([
    typeorm_1.Entity()
], Note);
exports.Note = Note;
