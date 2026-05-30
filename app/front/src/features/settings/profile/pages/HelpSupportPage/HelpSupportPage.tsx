import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageLayout } from "@/components/layout/PageLayout";

const faqItems = [
  {
    question: "Como vinculo um veículo ao meu perfil?",
    answer:
      "Entre em contato com o gestor da frota para associar seu cadastro ao veículo correto.",
  },
  {
    question: "Onde vejo meu histórico de passagens?",
    answer:
      "Acesse Histórico de passagens no menu lateral ou pelo link no seu perfil.",
  },
  {
    question: "Como altero minhas notificações?",
    answer:
      "Em Meu perfil, acesse Configuração de notificações e ajuste as preferências.",
  },
];

export const HelpSupportPage = () => {
  return (
    <PageLayout
      title="Ajuda e Suporte"
      description="Encontre respostas rápidas ou entre em contato com nossa equipe."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Perguntas frequentes</CardTitle>
            <CardDescription>
              Dúvidas comuns sobre o Taggy Ecoscore.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqItems.map((item) => (
              <div key={item.question} className="space-y-1">
                <p className="font-medium">{item.question}</p>
                <p className="text-sm text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contato</CardTitle>
            <CardDescription>Precisa de ajuda? Fale conosco.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <span className="text-muted-foreground">E-mail: </span>
              suporte@taggy.com.br
            </p>
            <p>
              <span className="text-muted-foreground">Telefone: </span>
              (11) 4000-0000
            </p>
            <p>
              <span className="text-muted-foreground">Horário: </span>
              Seg–Sex, 9h às 18h
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/perfil">Voltar ao perfil</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};
