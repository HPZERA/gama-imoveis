// A autenticação real acontece no servidor (src/proxy.ts), que redireciona
// requisições não autenticadas para /admin/login antes desta página
// renderizar. Este componente não faz mais nenhuma verificação client-side.
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
