import { AuthOptions, NextAuthOptions, User } from "next-auth";
import { CredentialsProvider } from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

export const authConfig : AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "johndoe@gmail.com" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) : Promise<User> => {
                let token;
                try {
                    if(!credentials?.email || !credentials?.password) {
                        throw new Error("L'adresse mail et le mot de passe sont requis")
                    }
                    token = await login(credentials.email, credentials.password)

                } catch (error : any) {
                    console.log(error.response.status);
                    if (error.response.status === 401) {
                        throw new Error("Adresse mail ou mot de passe incorrect")
                    }else{
                        throw new Error("Une erreur s'est produite")
                    }
                }
            
                const decodeToken = jwt_decode(token?.access?? '') as Partial<User & {user_id: string}>

                if(decodeToken?.user_id){
                    return {
                        id: decodeToken.user_id ?? "",
                        email: credentials?.email,
                        name: token?.access ?? "",
                        image: decodeToken.image,
                    }
                }   
                throw new Error("Une erreur s'est produite")
            }
        })
    ],
    callbacks: {
        async session({session, token}) {
            return {
                ...session,
                user: {
                    id: token?.id,
                    token: token?.accessToken ?? "",
                    refreshToken: token.refreshToken ?? ""

                }
            }
        },
        async jwt({token, user, account}) {
            if (user && account) {
                token = {
                    ...token,
                    id = user.id,
                    accessToken = user.token ?? "",
                    refreshToken = user.refreshToken ?? ""
                }
            }

            return token
        }
    },

    secret: process.env.JWT_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 2 * 24 * 60 * 60,
    },
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/logout",
        error: "/auth/error",
    }
} satisfies NextAuthOptions

