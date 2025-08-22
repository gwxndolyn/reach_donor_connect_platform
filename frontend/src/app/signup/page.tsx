import Link from "next/link";
import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome, donor!
        </h2>
        <form className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              formAction={signup}
              className="flex-1 rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700 shadow hover:bg-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              Sign up
            </button>
          </div>
        </form>
        <Link
          href="/login"
          className="block text-sm font-medium text-blue-700 text-center underline mt-4"
        >
          Already have an account? Log in
        </Link>
      </div>
    </div>
  );
}
