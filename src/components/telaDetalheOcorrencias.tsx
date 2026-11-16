
import React from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { detalhesStyles as styles } from '../styles/detalhes-ocorrencia';
import { router } from 'expo-router';

type Prioridade = 'alta' | 'media' | 'baixa';

type DadosOcorrencia = {
    descricao: string;
    local: string;
    categoria: string;
    prioridade: Prioridade;
    status: string;
    dataCriacao: string;
};

type Props = {
    ocorrencia: DadosOcorrencia;
};

const prioridades = {
    alta: 'Alta',
    media: 'Média',
    baixa: 'Baixa',
};

export default function TelaDetalhesOcorrencia({ ocorrencia }: Props) {
    const estiloPrioridade = {
        alta: styles.prioridadeAlta,
        media: styles.prioridadeMedia,
        baixa: styles.prioridadeBaixa,
    };

    const estiloTextoPrioridade = {
        alta: styles.textoAlta,
        media: styles.textoMedia,
        baixa: styles.textoBaixa,
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.conteudo}
        >
            <Pressable
                style={styles.botaoVoltar}
                onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
            >
                <Text style={{ fontSize: 24, color: '#000000' }}>←</Text>
            </Pressable>

            <Text style={styles.titulo}>Detalhes da ocorrência</Text>

            <View style={styles.cartao}>
                <Text style={styles.tituloSecao}>Descrição</Text>
                <Text style={styles.descricao}>{ocorrencia.descricao}</Text>
            </View>

            <View style={styles.cartao}>
                <Text style={styles.tituloSecao}>Informações da ocorrência</Text>

                <View style={styles.informacaoTexto}>
                    <Text style={styles.rotulo}>Local</Text>
                    <Text style={styles.valor}>{ocorrencia.local}</Text>
                </View>

                <View style={styles.separador} />

                <View style={styles.informacaoTexto}>
                    <Text style={styles.rotulo}>Categoria</Text>
                    <Text style={styles.valor}>{ocorrencia.categoria}</Text>
                </View>

                <View style={styles.separador} />

                <View style={styles.informacaoTexto}>
                    <Text style={styles.rotulo}>Data de criação</Text>
                    <Text style={styles.valor}>{ocorrencia.dataCriacao}</Text>
                </View>
            </View>

            <View style={styles.cartao}>
                <Text style={styles.tituloSecao}>Prioridade</Text>

                <View
                    style={[
                        styles.indicador,
                        estiloPrioridade[ocorrencia.prioridade],
                    ]}
                >
                    <Text
                        style={[
                            styles.textoIndicador,
                            estiloTextoPrioridade[ocorrencia.prioridade],
                        ]}
                    >
                        {prioridades[ocorrencia.prioridade]}
                    </Text>
                </View>
            </View>

            <View style={styles.painelAcompanhamento}>
                <Text style={styles.tituloAcompanhamento}>
                    Acompanhamento da ocorrência
                </Text>

                <Text style={styles.textoAcompanhamento}>
                    Status atual: {ocorrencia.status}
                </Text>
            </View>
        </ScrollView>
    );
}
