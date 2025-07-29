import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/code-editor";

if (!mongoose.connection.readyState) {
  mongoose.connect(MONGODB_URI, {
    dbName: "code-editor",
  });
}

export interface User {
  name: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.models.User || mongoose.model<User & mongoose.Document>("User", userSchema as any);

export interface CodeSnippet {
  email: string;
  language: string;
  code: string;
  filename: string;
  createdAt: Date;
  updatedAt: Date;
}

const codeSnippetSchema = new mongoose.Schema<CodeSnippet>({
  email: { type: String, required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  filename: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const CodeSnippetModel = mongoose.models.CodeSnippet || mongoose.model<CodeSnippet & mongoose.Document>("CodeSnippet", codeSnippetSchema as any);

export async function addUser(user: User) {
  const newUser = new UserModel(user);
  await newUser.save();
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const user = await UserModel.findOne({ email }).lean();
  if (!user) return undefined;
  return user as unknown as User;
}

export async function saveCodeSnippet(snippet: Omit<CodeSnippet, 'createdAt' | 'updatedAt'>): Promise<CodeSnippet> {
  const newSnippet = new CodeSnippetModel(snippet);
  await newSnippet.save();
  return newSnippet.toObject() as CodeSnippet;
}

export async function getCodeSnippetsByEmail(email: string): Promise<CodeSnippet[]> {
  const snippets = await CodeSnippetModel.find({ email })
    .sort({ updatedAt: -1 })
    .lean();
  return snippets as unknown as CodeSnippet[];
}

export async function getCodeSnippetById(id: string): Promise<CodeSnippet | null> {
  const snippet = await CodeSnippetModel.findById(id).lean();
  return snippet as CodeSnippet | null;
}

export async function updateCodeSnippet(id: string, updates: Partial<CodeSnippet>): Promise<CodeSnippet | null> {
  const snippet = await CodeSnippetModel.findByIdAndUpdate(
    id,
    { ...updates, updatedAt: new Date() },
    { new: true }
  ).lean();
  return snippet as CodeSnippet | null;
}

export async function deleteCodeSnippet(id: string): Promise<boolean> {
  const result = await CodeSnippetModel.findByIdAndDelete(id);
  return !!result;
} 