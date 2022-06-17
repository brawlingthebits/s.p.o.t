import { api } from "../services/api";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";

interface AuthProviderProps {
    children: ReactNode
} 

interface Address {
    zipCode: string 
    number: number 
    complement: string 
} 

interface signUpCredentials {
    name: string 
    email: string
    password: string 
    address: {
        zipCode: string 
        number: number 
        complement: string 
    } 
}

interface User {
    id: string
    name: string
    email: string
    password?: string
    address: Address
}

interface signInCredentials {
    email: string
    password: string 
}

interface AuthState { 
    accessToken: string 
    user: User
}

interface AuthContextData {
    toSignUp: (credentials: signUpCredentials) => void
    toSignIn: (credentials: signInCredentials) => void
    accessToken: string 
    user: User 
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider = ({ children }: AuthProviderProps) => {

    const [data, setData] = useState<AuthState>(() => {
        
        const accessToken = localStorage.getItem("@spot:accessToken")
        const user = localStorage.getItem("@spot:user")

        if (accessToken && user) {
            return { accessToken, user: JSON.parse(user) };
        }
        return {} as AuthState
    })

    // const toSignIn = useCallback(async ( { email, password }: signInCredentials) => {
    //     
    //     const response = await api.post("/users/signin", { email, password })
    //     console.log(response)
    //     const { accessToken, user } = response.data
    //     localStorage.setItem("@spot:accessToken", accessToken)
    //     localStorage.setItem("@spot:user", JSON.stringify(user))
    //     setData({ accessToken, user })
    // }, [])

        const toSignIn = (data: signInCredentials) => {
        const { email, password } = data
        console.log(data)
        api.post("/users/signin", 
        {
            email: email,
            password: password
        })
        .then((response) => {
            const  accessToken  = response.data.token
            const user = response.data.token
            
            localStorage.setItem("@spot:accessToken", accessToken)
            localStorage.setItem("@spot:user", JSON.stringify(user))
// 
            setData({ accessToken, user })
        })
        .catch((err) => {
            console.error(err)
        })
    } 

    const toSignUp = (data: signUpCredentials) => {
        const { name, email, password, address } = data 
        console.log(data)
        api
        .post("/users/signup", 
        {
            name: name, 
            email: email,
            password: password,
            address: {
                zipCode: address.zipCode, 
                number: address.number, 
                complement: address.complement 
            }
        })
        .then((response) => {
            console.log("Criou o usuário")
            // Adicionar toast de sucesso
        })
        .catch((err) => {
            console.log(err)
            // Adicionar toast de fracasso
        })
    }
    return (
        <AuthContext.Provider
            value={{ 
                toSignUp,
                toSignIn,
                accessToken: data.accessToken,
                user: data.user
            }}
        >
            { children }
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)