export interface User {
    token: {
      access_token: string,
      expires_at: string
    };

    user: {
      avatar: string,
      created_at: string,
      email: string,
      id: number,
      is_admin: number,
      name: string,
      updated_at: string
    };
}
