from providers.official_source_provider import OfficialSourceProvider


# Mock de banco de dados (simulação)
class FakeDB:
    def get_current_technical_specs(self):
        return None  # força usar fallback


def main():
    db = FakeDB()
    provider = OfficialSourceProvider(db)

    specs = provider.get_all_specs()

    print("\n=== TESTE SPECS ===")
    print(specs)


if __name__ == "__main__":
    main()