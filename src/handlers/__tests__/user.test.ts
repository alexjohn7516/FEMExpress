import * as user from "../user";

// NOTE have stateless tests. Tests must not rely on other tests
describe("User handler", () => {
  beforeEach(() => {
    // drop the database
  });
  it("Creates a new user", async () => {
    const req = {
      body: {
        user: {
          username: "foo",
          password: "bar",
        },
      },
    };
    const res = {
      // can make this a spy
      json({ token }) {
        expect(token).toBeTruthy();
      },
    };
    //@ts-ignore
    await user.createNewUser(req, res, () => {});
  });
  it("Signin a user and tests for Authentic JWT", () => {});
});
