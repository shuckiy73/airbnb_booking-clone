import dataclasses
import datetime
import json
import os
import re
from copy import deepcopy
from pprint import pprint

import environs
import psycopg2
from datetime import datetime, UTC


class FromJSONToDataBase:
    # TODO https://api.hh.ru/areas ---- api получения стран рядом с РБ. Вместе с их городами

    def load_env_data(self):
        env = environs.Env()
        env.read_env('.env')
        return env.str('DB_NAME'), env.str('DB_HOST'), env.str('DB_PORT'), env.str('DB_USER'), env.str('DB_PASSWORD')

    def connect_to_db(self, database, host, port, user, password):
        print(database)
        try:
            connection = psycopg2.connect(
                f"host={host} dbname={database} user={user} password={password} port={port}"
            )

        except Exception:
            print('Connection failed')
            connection = False
        return connection

    def _drop_all_tables(self, connection):
        cursor = connection.cursor()

        cursor.execute("""SELECT table_name
                FROM   information_schema.tables
                WHERE  table_schema = 'public';""")
        all_tables = cursor.fetchall()
        list_of_command = [f"DROP TABLE {table_name[0]} CASCADE" for table_name in all_tables]
        cursor.execute(';'.join(list_of_command))
        connection.commit()

    def _clear_user_tables(self, connection):
        cursor = connection.cursor()
        cursor.execute(
            """select information_schema.tables.table_name from information_schema.tables WHERE table_name LIKE 'api%'""")
        all_tables = cursor.fetchall()
        list_of_command = [f"DELETE FROM {table_name[0]}" for table_name in all_tables]
        cursor.execute(';'.join(list_of_command))
        connection.commit()

    @staticmethod
    def _get_load_json(path):
        if os.path.isfile(path):
            with open(path, 'r', encoding='utf8') as f:
                data = json.load(f)
                return data
        else:
            print(f'{path} is not a file!')

    @staticmethod
    def _parse_object_list_to_int(obj):
        return obj if isinstance(obj, int | None) else obj[0]

    def _read_row_from_db(self, cursor, table_field_id, table, where_field: str | tuple, equal_field: str | tuple,
                          fetchone=True, multiply_where=False):
        def _add_quotes(obj):
            return f"'{obj}'"

        if multiply_where:
            where = ' AND '.join((f"{field}={_add_quotes(equal) if equal else 'null'}" for field, equal in
                                  zip(where_field, equal_field)))
        else:
            where = f"{where_field}='{equal_field}'"
        cursor.execute(f"SELECT {table_field_id} FROM {table} WHERE {where};")
        row_id = cursor.fetchone() if fetchone else cursor.fetchall()
        return row_id

    def _write_row_to_db(self, cursor, table, list_of_fields: tuple, data: list, external_id: int = None):
        def _convert_price_to_str_from_dict(dictionary):
            return str(dictionary.get("BYN"))

        def _convert_to_query_str(row):
            if row is None:
                return f"({str(0.0)})"
            elif isinstance(row, int | float):
                return f"({str(row)})"
            result = []
            for item in row:

                if isinstance(item, int | float):
                    result.append(str(item))
                else:
                    if isinstance(item, dict):
                        result.append(_convert_price_to_str_from_dict(item))
                    else:
                        result.append(f"'{item}'" if item is not None else f"null")

            return f"({', '.join(result)})"

        if len(list_of_fields) == 1:
            data = ', '.join(
                # проверки на general attrs values!!!!
                # (f"('{item}')" if isinstance(item, str) else str(item) for item in data)
                (f"('{item}')" if isinstance(item, str) else f"({str(item) if item is not None else 'null'})" for item
                 in data)
            )
        else:
            buffer = []
            for row in data:
                # если для записи более одной записи в таблицу за 1 раз

                buffer.append(_convert_to_query_str(row))
                data = ', '.join(buffer)
        cursor.execute(f"INSERT INTO {table} ({', '.join(list_of_fields)}) VALUES {data} RETURNING id;")
        row_id = cursor.fetchone()

        return row_id

    def i_o_db_operations(self, connection, table: str, *, table_field_id: str = "id", where_field: str | tuple = None,
                          equal_field: str | tuple = None, fetchone: bool = True, multiply_where: bool = False,
                          list_of_fields: tuple = None, data: list = None, isdata_urls: bool = False,
                          external_id: int = None,
                          isonlyread_operation: bool = True, isonlywrite_operation: bool = True, ):
        """
        TODO: table_field_id: str = "id" или лучше оставить None ? "записал id т к при чтении из БТ всегда это поле
            нужно указывать"
        :param connection: соединение для подключения к БД
        :param table: имя таблицы
        :param table_field_id: указывается название столбца ID PK указанной таблицы.

        :param where_field: указывается один столбец для оператора WHERE запроса если multiply_where = Fasle.
                            Если multiply_where = True, то указывается итерируемый объект с названиями столбцов.
                            Количество полей должно совпадать с equal_field
        :param equal_field: значения для столбца указанного в where_field(при multiply_where = Fasle.).
                            Если multiply_where = True, то указывается итерируемый объект. Количество элементов
                            должно совпадать с where_field.
                            Если элементов будет указано меньше/больше, то элементы которым не будет пары, будут
                            отброшены.
        :param fetchone: влияет на количество строк/кортежей в ответе.
        :param multiply_where: влияет на количество элементов для передачи в where_field и equal_field.
                            Default False. передавать можно только по одному элементу.

        :param list_of_fields: Поле принимает итерируемый объект, элементы(итерируемые объекты!!!) название столбцов
        куда будут заноситься данные.
                            Используется если isonlyread_operation = False
        :param data: Поле принимает итерируемый объект, элементы(итерируемые объекты!!!) данные для столбцов,
                            которые указаны в list_of_fields. Используется если isonlyread_operation = False
        :param external_id: Указывается внешний id который нужно добавить к data после обработки всех переданных столбцов.
        :param isonlyread_operation: DEFAULT = True. влияет на то какой метод будет использоваться, так же от этого параметра зависит то,
                            какие аргументы будет принимать метод.
                            isonlyread_operation = False === DEFAULT!!!
                                _read_row_from_db(
                                    self,
                                    cursor,
                                    table_field_id,
                                    table,
                                    where_field: str | tuple,
                                    equal_field: str | tuple,
                                    fetchone=True,
                                    multiply_where=False
                                 ):

                            isonlyread_operation = True
                            _write_row_to_db(
                                    self,
                                    cursor,
                                    table,
                                    list_of_fields: tuple,
                                    data: list,
                                    external_id: int = None
                                ): ...
        :param isonlywrite_operation: DEFAULT True влияет на то какой метод будет использоваться, так же от этого параметра зависит то,
                            какие аргументы будет принимать метод.См параметр isonlyread_operation
        :return:
        """
        cursor = connection.cursor()
        if isonlyread_operation:
            row = self._read_row_from_db(
                cursor,
                table_field_id,
                table,
                where_field,
                equal_field,
                fetchone=fetchone,
                multiply_where=multiply_where
            )
        else:
            row = None

        if isonlywrite_operation:
            if not row:
                row = self._write_row_to_db(
                    cursor,
                    table,
                    list_of_fields,
                    data,
                    external_id=external_id
                )
                connection.commit()
        return self._parse_object_list_to_int(row)

    def move_image_files(self, from_path, to_path):
        import shutil
        if not os.path.exists(to_path):
            os.makedirs(to_path)
        if os.path.exists(from_path):
            shutil.move(from_path, to_path)

    def run(self):
        self.move_image_files('../async_parser/data/images',
                              r'../../../../..\front\autobuy\public')
        connection = self.connect_to_db(*self.load_env_data())

        if connection:
            cursor = connection.cursor()

            # Страны, регионы, города
            # json_data = self._get_load_json('files/countries_db.json')
            # # TODO: нужно что-то придумать с многократным вызовом метода i_o_db_operations
            # # TODO: 1а идея это все параметры закинуть в список словарей и потом распаковывать
            # for country, regions in json_data.items():
            #     if country in ("Россия", "Беларусь", "Украина"):
            #         try:
            #             cursor.execute(f"INSERT INTO api_apartment_search_countrymodel (name) VALUES ('{country}') RETURNING id;")
            #             country_id = cursor.fetchone()[0]
            #         except:
            #             connection.commit()
            #             cursor.execute(f"SELECT id FROM api_apartment_search_countrymodel WHERE name = '{country}';")
            #             country_id = cursor.fetchone()[0]
            #         connection.commit()
            #         print(country_id)
            #         for region, cities in regions.items():
            #             try:
            #                 cursor.execute(
            #                     f"INSERT INTO api_apartment_search_regionmodel (name, country_id) VALUES ('{region}', '{country_id}') RETURNING id;")
            #                 region_id = cursor.fetchone()[0]
            #             except:
            #                 connection.commit()
            #                 cursor.execute(
            #                     f"SELECT id FROM api_apartment_search_regionmodel WHERE name = '{region}' AND country_id = '{country_id}';")
            #                 region_id = cursor.fetchone()[0]
            #             connection.commit()
            #
            #             for city in cities:
            #                 try:
            #                     cursor.execute(
            #                         f"INSERT INTO api_apartment_search_citymodel (name, country_id, region_id) VALUES ('{city}', '{country_id}', '{region_id}') RETURNING id;")
            #                     city_id = cursor.fetchone()[0]
            #                 except:
            #                     connection.commit()
            #                     cursor.execute(
            #                         f"SELECT id FROM api_apartment_search_citymodel WHERE name = '{region}' AND country_id = '{country_id}' AND region_id = '{region_id}';")
            #                     city_id = cursor.fetchone()[0]
            #                 connection.commit()

            # # Типы улиц
            # street_types = ['бульвар', 'переулок', 'проспект', 'улица', 'шоссе', 'аллея', 'дорога', 'дорожка', 'жилмассив', 'киломерт', 'линия', 'набережная', 'площадь', 'проезд', 'просека', 'просёлок', 'проулок', 'спуск', 'трасса', 'тупик']
            # for street_type in street_types:
            #     try:
            #         cursor.execute(
            #             f"INSERT INTO api_apartment_search_streettypemodel (type) VALUES ('{street_type}') RETURNING id;")
            #         street_type_id = cursor.fetchone()[0]
            #     except:
            #         connection.commit()
            #         cursor.execute(
            #             f"SELECT id FROM api_apartment_search_streettypemodel WHERE type = '{street_type}' ;")
            #         street_type_id = cursor.fetchone()[0]
            #     connection.commit()


            # Группы номеров и их типы
            building_group_type = [
                'Номера, спальные места',
                'Квартиры, апартаменты',
                'Дома, коттеджи',
                'Отдельные комнаты',
            ]
            building_group_comment = [
                'в отеле, гостевом доме или хостеле',
                'целиком',
                'целиком',
                'целиком',

            ]
            building_group_description = [
                'Гостям будет предоставлен номер в отеле, гостевом доме или спальное место в хостеле',
                'Гости снимут квартиру целиком. Вместе со всеми удобствами и кухней',
                'Гости снимут дом целиком. Вместе с пристройками',
                'Гости снимут отдельную комнату со спальным местом',
            ]

            building_type = {
                'Номера, спальные места': ['Отель', 'Апарт-отель', 'Капсюльный отель', 'Санаторий', 'Гостиница',
                                           'Мини-гостиница', 'Хостел', 'База отдыха', 'Апартамент', 'Гостевой дом',
                                           'Отель эконом-класса', 'Пансионат', 'Глэмпинг'],
                'Квартиры, апартаменты': ['Квартира', 'Апартамент', 'Студия'],
                'Дома, коттеджи': ['Коттедж', 'Часть дома с отдельным входом', 'Таунхаус', 'Шале', 'Особняк', 'Дом',
                                   'Эллинг', 'Целый этаж в доме', 'Бунгало', 'Яхта', 'Вилла', 'Деревенский дом',
                                   'Гестхаус', 'Дом на колёсах', 'Дача'],
                'Отдельные комнаты': ['Комната в квартире', 'Комната в частном доме', 'Комната в коттедже']
            }


            for group, comment, description in zip(building_group_type, building_group_comment, building_group_description):
                # api_apartment_search_buildinggrouptypemodel
                # api_apartment_search_buildingtypemodel

                try:
                    cursor.execute(
                        f"INSERT INTO api_apartment_search_buildinggrouptypemodel (type, comment, description) VALUES ('{group}', '{comment}', '{description}') RETURNING id;")
                    group_type_id = cursor.fetchone()[0]
                except:
                    connection.commit()
                    cursor.execute(
                        f"SELECT id FROM api_apartment_search_buildinggrouptypemodel WHERE type = '{group}' ;")
                    group_type_id = cursor.fetchone()[0]
                connection.commit()
                type_list = building_type.get(group)

                for type in type_list:
                    try:
                        cursor.execute(
                            f"INSERT INTO api_apartment_search_buildingtypemodel (name, group_id) VALUES ('{type}', '{group_type_id}') RETURNING id;")
                        type_id = cursor.fetchone()[0]
                    except:
                        connection.commit()
                        cursor.execute(
                            f"SELECT id FROM api_apartment_search_buildingtypemodel WHERE name = '{type}' ;")
                        type_id = cursor.fetchone()[0]
                    connection.commit()



            # # заполнение вариантов кроватей
            # beds = ['односпальная кровать', 'двуспальная кровать', 'двуспальная диван-кровать',
            #  'двуспальная широкая (king-size)', 'особо широкая двуспальная (super-king-size)', 'двухъярусная кровать',
            #  'диван кровать']
            # for bed in beds:
            #     try:
            #         cursor.execute(
            #             f"INSERT INTO api_apartment_search_bedtypesmodel (type) VALUES ('{bed}') RETURNING id;")
            #         bed_id = cursor.fetchone()[0]
            #     except:
            #         connection.commit()
            #         cursor.execute(
            #             f"SELECT id FROM api_apartment_search_bedtypesmodel WHERE type = '{bed}' ;")
            #         bed_id = cursor.fetchone()[0]
            #     connection.commit()


            # # Заполнение вариантов удобств для ванной комнады api_apartment_search_bathroomamenitiesmodel
            # amenities = ['биде', 'ванна', 'гигиенический душ', 'дополнительная ванная', 'дополнительный туалет', 'душ', 'общая ванная комната', 'общий туалет', 'полотенца', 'сауна', 'тапочки', 'туалетные принадлежности', 'фен', 'халат', 'общий душ/душевая']
            #
            # for amenity in amenities:
            #     try:
            #         cursor.execute(
            #             f"INSERT INTO api_apartment_search_bathroomamenitiesmodel (name) VALUES ('{amenity}') RETURNING id;")
            #         amenity_id = cursor.fetchone()[0]
            #     except:
            #         connection.commit()
            #         cursor.execute(
            #             f"SELECT id FROM api_apartment_search_bathroomamenitiesmodel WHERE name = '{amenity}' ;")
            #         amenity_id = cursor.fetchone()[0]
            #     connection.commit()


            # # заполнение оставшихся различных удобств
            #
            # another_amenities = {
            #     'Удобства':'Популярные услуги и удобства, на которые чаще всего обращают внимание гости при поиске жилья. После публикации можно добавить другие',
            #     'Вид из окон':'Укажите, что можно увидеть из окон вашего объекта. В разделе «Фото» загрузите фотографии всех видов, которые вы отметили',
            #     'Кухонное оборудование':'',
            #     'Оснащение':'',
            #     'Для отдыха в помещении':'',
            #     'Оснащение двора':'',
            #     'Инфраструктура и досуг рядом':'',
            #     'Для детей':''
            # }
            #
            # dict_another_amenities = {
            #     'Удобства':['балкон', 'беспроводной интернет Wi-Fi', 'кондиционер', 'полотенца', 'постельное бельё', 'самоизоляция разрешена', 'СВЧ-печь', 'телевизор', 'фен', 'электрический чайник'],
            #     'Вид из окон':['на море', 'на горы', 'на город', 'на реку', 'на озеро', 'на лес', 'на парк', 'на улицу', 'во двор', 'на бассейн', 'на достопримечательность', 'на сад'],
            #     'Кухонное оборудование':['барная стойка', 'блендер', 'газовая плита', 'духовка', 'кофеварка', 'кофемашина', 'кухонный гарнитур', 'мини-бар', 'морозильник', 'мультиварка', 'обеденный стол', 'посуда и принадлежности', 'посудомоечная машина', 'СВЧ-печь', 'столовые приборы', 'тостер', 'турка для приготовления кофе', 'фильтр для воды', 'холодильник', 'электрический чайник', 'электроплита'],
            #     'Оснащение':['балкон', 'бассейн', 'беспроводной интернет Wi-Fi', 'вентилятор', 'вешалка для одежды', 'водонагреватель', 'газовый водонагреватель', 'гардеробная', 'гостиный уголок', 'деревянный/паркетный пол', 'джакузи (гидромассажная ванна)', 'домофон', 'журнальный столик', 'звукоизоляция', 'камин', 'ковровое покрытие', 'кондиционер', 'ламинат', 'линолеум', 'место для хранения лыж / сноуборда', 'металлическая дверь', 'москитная сетка', 'новогодняя ёлка', 'обогреватель', 'одеяла с электроподогревом', 'персональный компьютер', 'плиточный/мраморный пол', 'пляжные полотенца', 'проводной интернет', 'пылесос', 'рабочий стол', 'раскладная кровать', 'сейф', 'стиральная машина', 'сушилка для белья', 'сушильная машина', 'телефон', 'утюг с гладильной доской', 'центральное отопление', 'чистящие средства', 'шкаф', 'шторы блэкаут'],
            #     'Для отдыха в помещении':['Smart TV', 'бильярд', 'игровая консоль', 'кабельное ТВ', 'книги', 'музыкальный центр', 'настольные игры', 'настольный теннис', 'ноутбук', 'платные ТВ-каналы', 'радио', 'спутниковое ТВ', 'телевизор', 'эфирное ТВ'],
            #     'Оснащение двора':['банный чан', 'баня (на территории)', 'барбекю/мангал', 'бассейн с подогревом', 'беседка', 'веранда', 'гамак', 'гараж', 'детские качели', 'игровая площадка', 'лодка', 'мебель на улице', 'обеденная зона на улице', 'открытый бассейн', 'охраняемая территория', 'патио', 'пляжный зонтик', 'принадлежности для барбекю', 'садовая мебель', 'спортивный зал', 'терраса', 'футбольное поле', 'шезлонги'],
            #     'Инфраструктура и досуг рядом':['SPA-центр', 'альпинизм', 'баня (за территорией)', 'бильярдный клуб', 'боулинг', 'верховая езда', 'водные виды спорта', 'гольф', 'горные лыжи', 'езда на снегоходах', 'жильё находится в частном секторе', 'зоопарк', 'каток', 'кинотеатр', 'лес', 'ночной клуб', 'охота', 'парк аттракционов', 'прокат велосипедов', 'прокат роликовых коньков', 'пруд/озеро поблизости', 'рыбалка', 'театр', 'теннисный корт', 'Яхт-клуб'],
            #     'Для детей':['высокий стул для ребенка', 'детская кроватка', 'детский горшок', 'защита на окнах', 'защитные крышки на розетках', 'игры/игрушки для детей', 'кровать-манеж', 'пеленальный стол', 'стульчик для кормления']
            #
            # }
            # amenities_description = {
            #     'на море':'Если из вашего окна хорошо видно море',
            #     'на горы':'Если из окна видны горные панорамы или отдельные вершины',
            #     'на город':'Если из окна открывается широкий панорамный вид на город',
            #     'на реку':'Если из вашего окна хорошо видно реку',
            #     'на озеро':'Если из вашего окна хорошо видно озеро',
            # }
            # for another_amenity, description in another_amenities.items():
            #     try:
            #         cursor.execute(
            #             f"INSERT INTO api_apartment_search_categoriesamenitiesmodel (title, description) VALUES ('{another_amenity}', '{description}') RETURNING id;")
            #         another_amenity_id = cursor.fetchone()[0]
            #     except:
            #         connection.commit()
            #         cursor.execute(
            #             f"SELECT id FROM api_apartment_search_categoriesamenitiesmodel WHERE title = '{another_amenity}' ;")
            #         another_amenity_id = cursor.fetchone()[0]
            #     connection.commit()
            #     for amenity in dict_another_amenities.get(another_amenity):
            #         desc = amenities_description.get(amenity, '')
            #         try:
            #             cursor.execute(
            #                 f"INSERT INTO api_apartment_search_amenitiesmodel (name, description, category_id) VALUES ('{amenity}', '{desc}', '{another_amenity_id}') RETURNING id;")
            #             amenity_id = cursor.fetchone()[0]
            #         except:
            #             connection.commit()
            #             cursor.execute(
            #                 f"SELECT id FROM api_apartment_search_amenitiesmodel WHERE name = '{amenity}' ;")
            #             amenity_id = cursor.fetchone()[0]
            #         connection.commit()


db = FromJSONToDataBase()
db.run()

# Преобразование json со странами, регионами и городами
# data = db._get_load_json('files/countries.json')
# countries = {}
# for row in data:
#     country = row["name"]
#     countries.setdefault(country, {})
#     if row["areas"]:
#         for region in row["areas"]:
#             rgn = region["name"]
#             countries.get(country).setdefault(rgn, [])
#             if region["areas"]:
#                 for city in region["areas"]:
#                     c = city["name"]
#                     countries.get(country).get(rgn).append(c)
#             else:
#                 print(f"areas is empty: {rgn}")
#
#     else:
#         print(f"areas is empty: {country}")
#
#
# with open('files/countries_db.json', 'w', encoding='utf-8') as f:
#     json.dump(countries, f, indent=4, ensure_ascii=False, sort_keys=True)

# db._drop_all_tables(
#     db.connect_to_db(
#         *db.load_env_data()
#     )
# )

#
# db._clear_user_tables(
#     db.connect_to_db(
#         *db.load_env_data()
#     )
# )
