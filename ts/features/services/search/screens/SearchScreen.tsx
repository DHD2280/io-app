import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform, ViewStyle } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import {
  ContentWrapper,
  Divider,
  IOSpacingScale,
  IOToast,
  IOVisualCostants,
  ListItemHeader,
  SearchInput,
  SearchInputRef,
  VSpacer
} from "@pagopa/io-app-design-system";
import I18n from "../../../../i18n";
import { useInstitutionsFetcher } from "../hooks/useInstitutionsFetcher";
import { Institution } from "../../../../../definitions/services/Institution";
import { searchPaginatedInstitutionsGet } from "../store/actions";
import { useIONavigation } from "../../../../navigation/params/AppParamsList";
import { useIODispatch } from "../../../../store/hooks";
import { getLogoForInstitution } from "../../common/utils";
import { SERVICES_ROUTES } from "../../common/navigation/routes";
import { EmptyState } from "../../common/components/EmptyState";
import { ListItemSearchInstitution } from "../../common/components/ListItemSearchInstitution";
import { ServiceListSkeleton } from "../../common/components/ServiceListSkeleton";
import * as analytics from "../../common/analytics";

const INPUT_PADDING: IOSpacingScale = 16;
const LIST_ITEM_HEIGHT: number = 70;
const MIN_QUERY_LENGTH: number = 3;

export const SearchScreen = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useIODispatch();
  const navigation = useIONavigation();

  const searchInputRef = useRef<SearchInputRef>(null);
  const [query, setQuery] = useState<string>("");

  const containerStyle: ViewStyle = useMemo(
    () => ({
      marginTop: insets.top,
      paddingVertical: INPUT_PADDING
    }),
    [insets.top]
  );

  const {
    currentPage,
    data,
    fetchNextPage,
    fetchPage,
    isError,
    isLoading,
    isUpdating
  } = useInstitutionsFetcher();

  useFocusEffect(
    useCallback(() => {
      analytics.trackSearchPage();
      searchInputRef.current?.focus();
    }, [])
  );

  useEffect(() => {
    if (isError) {
      IOToast.error(I18n.t("global.genericError"));
    }
  }, [isError]);

  useEffect(
    () =>
      navigation.addListener("beforeRemove", _ =>
        dispatch(searchPaginatedInstitutionsGet.cancel())
      ),
    [dispatch, navigation]
  );

  const handleCancel = useCallback(() => navigation.goBack(), [navigation]);

  const handleChangeText = (text: string) => {
    setQuery(text);

    if (text.length >= MIN_QUERY_LENGTH) {
      analytics.trackSearchInput();
      fetchPage(0, text);
    } else {
      dispatch(searchPaginatedInstitutionsGet.cancel());
    }
  };

  const handleEndReached = useCallback(() => {
    if (!!data && query.length >= MIN_QUERY_LENGTH) {
      fetchNextPage(currentPage + 1, query);
      analytics.trackSearchResultScroll();
    }
  }, [currentPage, data, fetchNextPage, query]);

  const navigateToInstitution = useCallback(
    ({ fiscal_code, id, name }: Institution) => {
      analytics.trackInstitutionSelected({
        organization_fiscal_code: fiscal_code,
        organization_name: name,
        source: "search_list"
      });

      navigation.navigate(SERVICES_ROUTES.SERVICES_NAVIGATOR, {
        screen: SERVICES_ROUTES.INSTITUTION_SERVICES,
        params: {
          institutionId: id,
          institutionName: name
        }
      });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Institution>) => (
      <ListItemSearchInstitution
        value={item.name}
        numberOfLines={2}
        onPress={() => navigateToInstitution(item)}
        accessibilityLabel={item.name}
        avatarProps={{
          source: getLogoForInstitution(item.fiscal_code)
        }}
      />
    ),
    [navigateToInstitution]
  );

  const renderListFooterComponent = useCallback(() => {
    if (isUpdating) {
      return <ServiceListSkeleton />;
    }

    return <VSpacer size={16} />;
  }, [isUpdating]);

  const renderListEmptyComponent = useCallback(() => {
    if (query.length < MIN_QUERY_LENGTH) {
      return (
        <EmptyState
          pictogram="searchLens"
          title={I18n.t("services.search.emptyState.invalidQuery.title")}
        />
      );
    }

    if (data?.institutions.length === 0) {
      return (
        <EmptyState
          pictogram="umbrella"
          title={I18n.t("services.search.emptyState.noResults.title")}
          subtitle={I18n.t("services.search.emptyState.noResults.subtitle")}
        />
      );
    }

    if (isLoading) {
      return <ServiceListSkeleton sectionTitleShown />;
    }

    return null;
  }, [isLoading, query, data?.institutions]);

  const renderListHeaderComponent = useCallback(() => {
    if ((data?.count ?? 0) > 0) {
      return (
        <ListItemHeader
          label={I18n.t("services.search.list.header.title")}
          endElement={{
            type: "badge",
            componentProps: {
              text: `${data?.count}`,
              variant: "default"
            }
          }}
        />
      );
    }

    return null;
  }, [data?.count]);

  return (
    <>
      <ContentWrapper style={containerStyle}>
        <SearchInput
          accessibilityLabel={I18n.t("services.search.input.placeholderShort")}
          autoFocus={true}
          cancelButtonLabel={I18n.t("services.search.input.cancel")}
          clearAccessibilityLabel={I18n.t("services.search.input.clear")}
          keepCancelVisible={true}
          onCancel={handleCancel}
          onChangeText={handleChangeText}
          placeholder={I18n.t("services.search.input.placeholderShort")}
          ref={searchInputRef}
          value={query}
        />
      </ContentWrapper>
      <FlashList
        ItemSeparatorComponent={Divider}
        ListEmptyComponent={renderListEmptyComponent}
        ListFooterComponent={renderListFooterComponent}
        ListHeaderComponent={renderListHeaderComponent}
        contentContainerStyle={{
          paddingHorizontal: IOVisualCostants.appMarginDefault
        }}
        data={data?.institutions}
        estimatedItemSize={LIST_ITEM_HEIGHT}
        keyboardDismissMode={Platform.select({
          ios: "interactive",
          default: "on-drag"
        })}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item, index) => `institution-${item.id}-${index}`}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        renderItem={renderItem}
      />
    </>
  );
};
