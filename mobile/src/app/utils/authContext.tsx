import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type User = {
  id: string;
  name: string;
  usuario: string;
};

export type Transaction = {
  id: string;
  title: string;
  value: number; // positivo = crédito, negativo = débito
  date: string; // dd/mm/yyyy HH:mm
};

export type Wallet = {
  saldo: number;
  activePass: string | null;
  passExpiry: string | null; // dd/mm/yyyy HH:mm
  favoritos: string[]; // linhas favoritas, ex: "302"
  historico: Transaction[];
};

type StoredUser = User & {
  senha: string;
};

type RegisterResult =
  | { ok: true }
  | { ok: false; message: string };

type AuthContextType = {
  isReding: boolean; // mantido com o mesmo nome/typo já usado nas telas
  isLoggedIn: boolean;
  user: User | null;
  wallet: Wallet;

  logIn: (
    usuario: string,
    senha: string
  ) => Promise<boolean>;

  logOut: () => Promise<void>;

  register: (
    name: string,
    usuario: string,
    senha: string
  ) => Promise<RegisterResult>;

  recharge: (amount: number) => Promise<void>;

  activatePass: (
    passName: string,
    price: number
  ) => Promise<{
    ok: boolean;
    message?: string;
  }>;

  toggleFavorite: (line: string) => Promise<void>;
};

const USERS_KEY = "voyage-users";
const SESSION_KEY = "voyage-session";
const DEMO_USER: StoredUser = {
  id: "demo-user",
  name: "Usuário Demo",
  usuario: "demo@voyage.com",
  senha: "123456",
};

const walletKey = (usuario: string) =>
  `voyage-wallet-${usuario.toLowerCase()}`;

const emptyWallet: Wallet = {
  saldo: 0,
  activePass: null,
  passExpiry: null,
  favoritos: [],
  historico: [],
};

function now() {
  const d = new Date();

  const pad = (n: number) =>
    n.toString().padStart(2, "0");

  return `${pad(d.getDate())}/${pad(
    d.getMonth() + 1
  )}/${d.getFullYear()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

async function getUsers(): Promise<StoredUser[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  const users: StoredUser[] = raw ? JSON.parse(raw) : [];
  if (users.some((user) => user.usuario.toLowerCase() === DEMO_USER.usuario)) {
    return users;
  }

  const usersWithDemo = [...users, DEMO_USER];
  await saveUsers(usersWithDemo);
  return usersWithDemo;
}

async function saveUsers(users: StoredUser[]) {
  await AsyncStorage.setItem(
    USERS_KEY,
    JSON.stringify(users)
  );
}

async function getWallet(
  usuario: string
): Promise<Wallet> {
  const raw = await AsyncStorage.getItem(
    walletKey(usuario)
  );

  return raw ? JSON.parse(raw) : { ...emptyWallet };
}

async function saveWallet(
  usuario: string,
  wallet: Wallet
) {
  await AsyncStorage.setItem(
    walletKey(usuario),
    JSON.stringify(wallet)
  );
}

export const AuthContext =
  createContext<AuthContextType>({
    isReding: true,
    isLoggedIn: false,
    user: null,
    wallet: emptyWallet,

    logIn: async () => false,

    logOut: async () => {},

    register: async () => ({
      ok: false,
      message: "",
    }),

    recharge: async () => {},

    activatePass: async () => ({
      ok: false,
    }),

    toggleFavorite: async () => {},
  });

export default function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isReding, setIsReding] = useState(true);

  const [user, setUser] = useState<User | null>(null);

  const [wallet, setWallet] =
    useState<Wallet>(emptyWallet);

  useEffect(() => {
    (async () => {
      try {
        const session =
          await AsyncStorage.getItem(SESSION_KEY);

        if (session) {
          const users = await getUsers();

          const found = users.find(
            (u) =>
              u.usuario.toLowerCase() ===
              session.toLowerCase()
          );

          if (found) {
            setUser({
              id: found.id,
              name: found.name,
              usuario: found.usuario,
            });

            setWallet(
              await getWallet(found.usuario)
            );
          } else {
            await AsyncStorage.removeItem(
              SESSION_KEY
            );
          }
        }
      } finally {
        setIsReding(false);
      }
    })();
  }, []);

  async function logIn(
    usuario: string,
    senha: string
  ): Promise<boolean> {
    const users = await getUsers();

    const found = users.find(
      (u) =>
        u.usuario.toLowerCase() ===
          usuario.toLowerCase() &&
        u.senha === senha
    );

    if (!found) return false;

    await AsyncStorage.setItem(
      SESSION_KEY,
      found.usuario
    );

    setUser({
      id: found.id,
      name: found.name,
      usuario: found.usuario,
    });

    setWallet(
      await getWallet(found.usuario)
    );

    return true;
  }

  async function logOut() {
    await AsyncStorage.removeItem(SESSION_KEY);

    setUser(null);
    setWallet(emptyWallet);
  }

  async function register(
    name: string,
    usuario: string,
    senha: string
  ): Promise<RegisterResult> {
    const users = await getUsers();

    if (
      users.some(
        (u) =>
          u.usuario.toLowerCase() ===
          usuario.toLowerCase()
      )
    ) {
      return {
        ok: false,
        message: "Este usuário já está cadastrado.",
      };
    }

    const newUser: StoredUser = {
      id: Date.now().toString(),
      name,
      usuario,
      senha,
    };

    await saveUsers([...users, newUser]);

    await saveWallet(usuario, emptyWallet);

    // Cadastro concluído -> já autentica o usuário automaticamente
    await AsyncStorage.setItem(
      SESSION_KEY,
      usuario
    );

    setUser({
      id: newUser.id,
      name: newUser.name,
      usuario: newUser.usuario,
    });

    setWallet(emptyWallet);

    return {
      ok: true,
    };
  }

  async function recharge(amount: number) {
    if (!user || amount <= 0) return;

    const next: Wallet = {
      ...wallet,

      saldo: wallet.saldo + amount,

      historico: [
        {
          id: Date.now().toString(),
          title: "Recarga realizada",
          value: amount,
          date: now(),
        },
        ...wallet.historico,
      ],
    };

    setWallet(next);

    await saveWallet(user.usuario, next);
  }

  async function activatePass(
    passName: string,
    price: number
  ) {
    if (!user) {
      return {
        ok: false,
        message: "Você precisa estar logado.",
      };
    }

    if (wallet.saldo < price) {
      return {
        ok: false,
        message:
          "Saldo insuficiente para ativar este passe.",
      };
    }

    const expiry = new Date();

    if (passName === "Mensal") {
      expiry.setDate(expiry.getDate() + 30);
    } else if (passName === "Regional") {
      expiry.setDate(expiry.getDate() + 7);
    } else {
      // Único/Diário valem até o fim do dia
      expiry.setHours(23, 59, 0, 0);
    }

    const pad = (n: number) =>
      n.toString().padStart(2, "0");

    const expiryStr = `${pad(
      expiry.getDate()
    )}/${pad(
      expiry.getMonth() + 1
    )}/${expiry.getFullYear()} ${pad(
      expiry.getHours()
    )}:${pad(expiry.getMinutes())}`;

    const next: Wallet = {
      ...wallet,

      saldo: wallet.saldo - price,

      activePass: passName,

      passExpiry: expiryStr,

      historico: [
        {
          id: Date.now().toString(),
          title: `Passe ${passName}`,
          value: -price,
          date: now(),
        },
        ...wallet.historico,
      ],
    };

    setWallet(next);

    await saveWallet(user.usuario, next);

    return {
      ok: true,
    };
  }

  async function toggleFavorite(line: string) {
    if (!user) return;

    const favoritos = wallet.favoritos.includes(line)
      ? wallet.favoritos.filter(
          (l) => l !== line
        )
      : [...wallet.favoritos, line];

    const next: Wallet = {
      ...wallet,
      favoritos,
    };

    setWallet(next);

    await saveWallet(user.usuario, next);
  }

  const value = useMemo(
    () => ({
      isReding,
      isLoggedIn: !!user,
      user,
      wallet,
      logIn,
      logOut,
      register,
      recharge,
      activatePass,
      toggleFavorite,
    }),
    [isReding, user, wallet]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}