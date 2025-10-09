import { User, Board, List, Card } from "./types";

// Mock data store (simulates backend)
class DataStore {
  private users: User[] = [];
  private boards: Board[] = [];
  private lists: List[] = [];
  private cards: Card[] = [];
  private currentUser: User | null = null;

  // Auth
  register(email: string, password: string, name: string): User {
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const user: User = {
      id: `user-${Date.now()}`,
      email,
      name,
    };
    this.users.push(user);
    this.currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(user));
    return user;
  }

  login(email: string, password: string): User {
    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    this.currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(user));
    return user;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem("currentUser");
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;
    
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      this.currentUser = JSON.parse(stored);
    }
    return this.currentUser;
  }

  // Boards
  getBoards(userId: string): Board[] {
    return this.boards.filter(b => b.userId === userId);
  }

  createBoard(title: string, userId: string): Board {
    const board: Board = {
      id: `board-${Date.now()}`,
      title,
      userId,
      createdAt: new Date().toISOString(),
    };
    this.boards.push(board);
    this.saveToLocalStorage();
    return board;
  }

  deleteBoard(boardId: string) {
    this.boards = this.boards.filter(b => b.id !== boardId);
    this.lists = this.lists.filter(l => l.boardId !== boardId);
    this.cards = this.cards.filter(c => {
      const list = this.lists.find(l => l.id === c.listId);
      return list?.boardId !== boardId;
    });
    this.saveToLocalStorage();
  }

  // Lists
  getLists(boardId: string): List[] {
    return this.lists
      .filter(l => l.boardId === boardId)
      .sort((a, b) => a.order - b.order);
  }

  createList(title: string, boardId: string): List {
    const existingLists = this.getLists(boardId);
    const list: List = {
      id: `list-${Date.now()}`,
      title,
      boardId,
      order: existingLists.length,
    };
    this.lists.push(list);
    this.saveToLocalStorage();
    return list;
  }

  updateListOrder(listId: string, newOrder: number) {
    const list = this.lists.find(l => l.id === listId);
    if (list) {
      list.order = newOrder;
      this.saveToLocalStorage();
    }
  }

  updateList(listId: string, updates: Partial<List>) {
    const list = this.lists.find(l => l.id === listId);
    if (list) {
      Object.assign(list, updates);
      this.saveToLocalStorage();
    }
  }

  deleteList(listId: string) {
    this.lists = this.lists.filter(l => l.id !== listId);
    this.cards = this.cards.filter(c => c.listId !== listId);
    this.saveToLocalStorage();
  }

  // Cards
  getCards(listId: string): Card[] {
    return this.cards
      .filter(c => c.listId === listId)
      .sort((a, b) => a.order - b.order);
  }

  createCard(title: string, listId: string): Card {
    const existingCards = this.getCards(listId);
    const card: Card = {
      id: `card-${Date.now()}`,
      title,
      description: "",
      isDone: false,
      listId,
      order: existingCards.length,
    };
    this.cards.push(card);
    this.saveToLocalStorage();
    return card;
  }

  updateCard(cardId: string, updates: Partial<Card>) {
    const card = this.cards.find(c => c.id === cardId);
    if (card) {
      Object.assign(card, updates);
      this.saveToLocalStorage();
    }
  }

  updateCardOrder(cardId: string, newListId: string, newOrder: number) {
    const card = this.cards.find(c => c.id === cardId);
    if (card) {
      card.listId = newListId;
      card.order = newOrder;
      this.saveToLocalStorage();
    }
  }

  deleteCard(cardId: string) {
    this.cards = this.cards.filter(c => c.id !== cardId);
    this.saveToLocalStorage();
  }

  // Persistence
  private saveToLocalStorage() {
    localStorage.setItem("boards", JSON.stringify(this.boards));
    localStorage.setItem("lists", JSON.stringify(this.lists));
    localStorage.setItem("cards", JSON.stringify(this.cards));
  }

  loadFromLocalStorage() {
    const boards = localStorage.getItem("boards");
    const lists = localStorage.getItem("lists");
    const cards = localStorage.getItem("cards");

    if (boards) this.boards = JSON.parse(boards);
    if (lists) this.lists = JSON.parse(lists);
    if (cards) this.cards = JSON.parse(cards);
  }
}

export const dataStore = new DataStore();
dataStore.loadFromLocalStorage();
