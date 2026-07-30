import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { BottomSheetFlatList, BottomSheetScrollView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Check, ChevronRight, Pencil, Plus, ShoppingCart, Trash2, X } from "lucide-react-native";
import { toast } from "sonner-native";
import { colors, COLORS_PALETTE } from "../../../shared/constants/colors";
import { ICON_CATALOG, getIconByKey } from "../../../shared/constants/iconCatalog";
import type { CategoryResponse, SubcategoryResponse } from "../../profile/api/catalog";
import {
  useCreateCategory,
  useCreateSubcategory,
  useDeleteCategory,
  useDeleteSubcategory,
  useUpdateCategory,
  useUpdateSubcategory,
  useUserCategories,
} from "../../profile/hooks/useUserData";
import { getApiError } from "@/src/shared/utils/common";

type Mode = "list" | "create-category" | "edit-category" | "subcategories" | "create-subcategory" | "edit-subcategory" | "pick-icon" | "pick-color" | "pick-sub-icon";

type Props = {
  onSnapChange?: (snaps: string[]) => void;
};

export function CategoryManagerSheet({ onSnapChange }: Props) {
  const { data: categories, isLoading } = useUserCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const createSubcategory = useCreateSubcategory();
  const updateSubcategory = useUpdateSubcategory();
  const deleteSubcategory = useDeleteSubcategory();

  const [mode, setModeState] = useState<Mode>("list");
  const setMode = (newMode: Mode, ..._rest: any[]) => {
    setModeState(newMode);
    if (!onSnapChange) return;
    if (newMode === "list") {
      onSnapChange(categories && categories.length < 3 ? ["35%"] : ["75%"]);
    } else if (newMode === "subcategories") {
      onSnapChange(selectedCategory && selectedCategory.subcategories.length < 3 ? ["35%"] : ["75%"]);
    } else {
      onSnapChange(["75%"]);
    }
  };
  const openSubcategories = (cat: CategoryResponse) => {
    setSelectedCategory(cat);
    setModeState("subcategories");
    onSnapChange?.(cat.subcategories.length < 3 ? ["35%"] : ["75%"]);
  };

  useEffect(() => {
    if (!onSnapChange || !categories) return;
    onSnapChange(categories.length < 3 ? ["35%"] : ["75%"]);
  }, [categories, onSnapChange]);

  const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubcategoryResponse | null>(null);

  const [catName, setCatName] = useState("");
  const [catIcon, setCatIcon] = useState("");
  const [catColor, setCatColor] = useState("");
  const [catTypeId, setCatTypeId] = useState(1);

  const [subName, setSubName] = useState("");
  const [subIcon, setSubIcon] = useState("");

  const resetCategoryForm = () => {
    setCatName("");
    setCatIcon("");
    setCatColor("");
    setCatTypeId(1);
  };

  const resetSubcategoryForm = () => {
    setSubName("");
    setSubIcon("");
  };

  const handleCreateCategory = async () => {
    if (!catName.trim()) {
      toast.error("El nombre es requerido");
      return;
    }
    try {
      await createCategory.mutateAsync({
        name: catName.trim(),
        icon: catIcon.trim() || undefined,
        color: catColor.trim() || undefined,
        transactionTypeId: catTypeId,
      });
      toast.success("Categoría creada");
      resetCategoryForm();
      setMode("list");
    } catch (error) {
      toast.error(getApiError(error).message);
    }
  }

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;
    try {
      await updateCategory.mutateAsync({
        id: selectedCategory.id,
        body: {
          name: catName.trim() || undefined,
          icon: catIcon.trim() || undefined,
          color: catColor.trim() || undefined,
        },
      });
      toast.success("Categoría actualizada");
      setMode("list");
    } catch (error) {
      toast.error(getApiError(error).message);
    }
  };

  const handleDeleteCategory = (cat: CategoryResponse) => {
    Alert.alert("Eliminar categoría", `¿Eliminar "${cat.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteCategory.mutateAsync(cat.id);
            toast.success("Categoría eliminada");
          } catch (error) {
            toast.error(getApiError(error).message);
          }
        },
      },
    ]);
  };

  const handleCreateSubcategory = async () => {
    if (!subName.trim() || !selectedCategory) return;
    try {
      await createSubcategory.mutateAsync({
        categoryId: selectedCategory.id,
        name: subName.trim(),
        icon: subIcon.trim() || undefined,
      });
      toast.success("Subcategoría creada");
      resetSubcategoryForm();
      setMode("subcategories");
    } catch (error) {
      toast.error(getApiError(error).message);
    }
  };

  const handleUpdateSubcategory = async () => {
    if (!selectedSubcategory) return;
    try {
      await updateSubcategory.mutateAsync({
        id: selectedSubcategory.id,
        body: {
          name: subName.trim() || undefined,
          icon: subIcon.trim() || undefined,
        },
      });
      toast.success("Subcategoría actualizada");
      setMode("subcategories");
    } catch (error) {
      toast.error(getApiError(error).message);
    }
  };

  const handleDeleteSubcategory = (sub: SubcategoryResponse) => {
    Alert.alert("Eliminar subcategoría", `¿Eliminar "${sub.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteSubcategory.mutateAsync(sub.id);
            toast.success("Subcategoría eliminada");
          } catch (error) {
            toast.error(getApiError(error).message);
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={localStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderCategoryItem = ({ item }: { item: CategoryResponse }) => {
    const isOwn = !item.isSystem;
    return (
      <TouchableOpacity
        style={localStyles.item}
        activeOpacity={0.6}
        onPress={() => openSubcategories(item)}
      >
        <View style={[localStyles.colorDot, { backgroundColor: item.color || colors.primary }]}/>
        <View style={localStyles.itemInfo}>
          <Text style={localStyles.itemName}>{item.name}</Text>
          <Text style={localStyles.itemBadge}>
            {item.transactionTypeId === 1 ? "Gasto" : "Ingreso"} · {item.isSystem ? "Sistema" : "Propia"}
          </Text>
        </View>
        <Text style={localStyles.subCount}>{item.subcategories.length}</Text>
        {isOwn && (
          <View style={localStyles.actions}>
            <TouchableOpacity
              onPress={() => {
                setSelectedCategory(item);
                setCatName(item.name);
                setCatIcon(item.icon ?? "");
                setCatColor(item.color ?? "");
                setMode("edit-category");
              }}
              style={localStyles.iconBtn}
            >
              <Pencil size={16} color={colors.textTertiary} strokeWidth={1.8} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteCategory(item)} style={localStyles.iconBtn}>
              <Trash2 size={16} color={colors.danger} strokeWidth={1.8} />
            </TouchableOpacity>
          </View>
        )}
        <ChevronRight size={16} color={colors.textTertiary} strokeWidth={1.8} />
      </TouchableOpacity>
    );
  };

  if (mode === "pick-icon") {
    return (
      <View style={{ flex: 1 }}>
        <View style={localStyles.headerRow}>
          <TouchableOpacity onPress={() => setMode(selectedCategory ? "edit-category" : "create-category")}>
            <Text style={{ color: colors.primary, fontSize: 16 }}>Atrás</Text>
          </TouchableOpacity>
          <Text style={localStyles.title}>Seleccionar icono</Text>
          <View style={{ width: 50 }} />
        </View>
        <BottomSheetScrollView contentContainerStyle={localStyles.pickerGridContent}>
          <View style={localStyles.iconGrid}>
            {ICON_CATALOG.map((item) => {
              const isSelected = item.key === catIcon;
              const IconComp = item.icon;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[localStyles.pickerItem, isSelected && localStyles.pickerItemSelected]}
                  onPress={() => {
                    setCatIcon(item.key);
                    setMode(selectedCategory ? "edit-category" : "create-category");
                  }}
                  activeOpacity={0.7}
                >
                  <IconComp size={24} color={isSelected ? "#fff" : colors.textSecondary} strokeWidth={1.8} />
                  <Text style={[localStyles.pickerLabel, isSelected && localStyles.pickerLabelSelected]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </BottomSheetScrollView>
      </View>
    );
  }

  if (mode === "pick-sub-icon") {
    return (
      <View style={{ flex: 1 }}>
        <View style={localStyles.headerRow}>
          <TouchableOpacity onPress={() => setMode(selectedSubcategory ? "edit-subcategory" : "create-subcategory")}>
            <Text style={{ color: colors.primary, fontSize: 16 }}>Atrás</Text>
          </TouchableOpacity>
          <Text style={localStyles.title}>Seleccionar icono</Text>
          <View style={{ width: 50 }} />
        </View>
        <BottomSheetScrollView contentContainerStyle={localStyles.pickerGridContent}>
          <View style={localStyles.iconGrid}>
            {ICON_CATALOG.map((item) => {
              const isSelected = item.key === subIcon;
              const IconComp = item.icon;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[localStyles.pickerItem, isSelected && localStyles.pickerItemSelected]}
                  onPress={() => {
                    setSubIcon(item.key);
                    setMode(selectedSubcategory ? "edit-subcategory" : "create-subcategory");
                  }}
                  activeOpacity={0.7}
                >
                  <IconComp size={24} color={isSelected ? "#fff" : colors.textSecondary} strokeWidth={1.8} />
                  <Text style={[localStyles.pickerLabel, isSelected && localStyles.pickerLabelSelected]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </BottomSheetScrollView>
      </View>
    );
  }

  if (mode === "pick-color") {
    const prevMode = selectedCategory ? "edit-category" : "create-category";
    return (
      <View style={{ flex: 1 }}>
        <View style={localStyles.headerRow}>
          <TouchableOpacity onPress={() => setMode(prevMode)}>
            <Text style={{ color: colors.primary, fontSize: 16 }}>Atrás</Text>
          </TouchableOpacity>
          <Text style={localStyles.title}>Seleccionar color</Text>
          <View style={{ width: 50 }} />
        </View>
        <View style={localStyles.colorGrid}>
          {COLORS_PALETTE.map((color) => {
            const isSelected = color === catColor;
            return (
              <TouchableOpacity
                key={color}
                style={[localStyles.colorSwatch, { backgroundColor: color }, isSelected && localStyles.colorSwatchSelected]}
                onPress={() => {
                  setCatColor(color);
                  setMode(prevMode);
                }}
                activeOpacity={0.7}
              >
                {isSelected && <Check size={18} color="#fff" strokeWidth={3} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  if (mode === "create-category") {
    const PreviewIcon = catIcon ? getIconByKey(catIcon) : ShoppingCart;

    return (
      <BottomSheetScrollView contentContainerStyle={localStyles.form}>
          <View style={[localStyles.headerRow, localStyles.headerRowInForm]}>
            <Text style={localStyles.title}>Nueva categoría</Text>
          <TouchableOpacity onPress={() => { resetCategoryForm(); setMode("list"); }}>
            <X size={20} color={colors.textTertiary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <Text style={localStyles.label}>Nombre</Text>
        <BottomSheetTextInput style={localStyles.input} placeholder="Ej. Comida" placeholderTextColor={colors.textTertiary} value={catName} onChangeText={setCatName} maxLength={100} />

        <Text style={localStyles.label}>Icono</Text>
        <TouchableOpacity style={localStyles.pickerTrigger} onPress={() => setMode("pick-icon")}>
          <View style={[localStyles.triggerIconPreview, { backgroundColor: catColor || colors.primaryLight }]}>
            <PreviewIcon size={18} color={catColor ? "#fff" : colors.primary} strokeWidth={1.8} />
          </View>
          <Text style={[localStyles.triggerText, !catIcon && localStyles.triggerPlaceholder]}>
            {ICON_CATALOG.find((i) => i.key === catIcon)?.label || "Seleccionar icono"}
          </Text>
          <ChevronRight size={16} color={colors.textTertiary} strokeWidth={1.8} />
        </TouchableOpacity>

        <Text style={localStyles.label}>Color</Text>
        <TouchableOpacity style={localStyles.pickerTrigger} onPress={() => setMode("pick-color")}>
          <View style={[localStyles.triggerColorPreview, { backgroundColor: catColor || colors.border }]} />
          <Text style={[localStyles.triggerText, !catColor && localStyles.triggerPlaceholder]}>
            {catColor || "Seleccionar color"}
          </Text>
          <ChevronRight size={16} color={colors.textTertiary} strokeWidth={1.8} />
        </TouchableOpacity>

        <Text style={localStyles.label}>Tipo</Text>
        <View style={localStyles.typeRow}>
          <TouchableOpacity style={[localStyles.typePill, catTypeId === 1 && localStyles.typePillActive]} onPress={() => setCatTypeId(1)}>
            <Text style={[localStyles.typePillText, catTypeId === 1 && localStyles.typePillTextActive]}>Gasto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[localStyles.typePill, catTypeId === 2 && localStyles.typePillActive]} onPress={() => setCatTypeId(2)}>
            <Text style={[localStyles.typePillText, catTypeId === 2 && localStyles.typePillTextActive]}>Ingreso</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={localStyles.saveBtn} onPress={handleCreateCategory} disabled={createCategory.isPending}>
          {createCategory.isPending ? <ActivityIndicator size="small" color="#fff" /> : <Text style={localStyles.saveBtnText}>Crear categoría</Text>}
        </TouchableOpacity>
      </BottomSheetScrollView>
    );
  };

  if (mode === "edit-category" && selectedCategory) {
    const PreviewIcon = catIcon ? getIconByKey(catIcon) : ShoppingCart;

    return (
      <BottomSheetScrollView contentContainerStyle={localStyles.form}>
          <View style={[localStyles.headerRow, localStyles.headerRowInForm]}>
            <Text style={localStyles.title}>Editar categoría</Text>
          <TouchableOpacity onPress={() => setMode("list")}>
            <X size={20} color={colors.textTertiary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <Text style={localStyles.label}>Nombre</Text>
        <BottomSheetTextInput style={localStyles.input} value={catName} onChangeText={setCatName} maxLength={100} />

        <Text style={localStyles.label}>Icono</Text>
        <TouchableOpacity style={localStyles.pickerTrigger} onPress={() => setMode("pick-icon")}>
          <View style={[localStyles.triggerIconPreview, { backgroundColor: catColor || colors.primaryLight }]}>
            <PreviewIcon size={18} color={catColor ? "#fff" : colors.primary} strokeWidth={1.8} />
          </View>
          <Text style={[localStyles.triggerText, !catIcon && localStyles.triggerPlaceholder]}>
            {ICON_CATALOG.find((i) => i.key === catIcon)?.label || "Seleccionar icono"}
          </Text>
          <ChevronRight size={16} color={colors.textTertiary} strokeWidth={1.8} />
        </TouchableOpacity>

        <Text style={localStyles.label}>Color</Text>
        <TouchableOpacity style={localStyles.pickerTrigger} onPress={() => setMode("pick-color")}>
          <View style={[localStyles.triggerColorPreview, { backgroundColor: catColor || colors.border }]} />
          <Text style={[localStyles.triggerText, !catColor && localStyles.triggerPlaceholder]}>
            {catColor || "Seleccionar color"}
          </Text>
          <ChevronRight size={16} color={colors.textTertiary} strokeWidth={1.8} />
        </TouchableOpacity>

        <TouchableOpacity style={localStyles.saveBtn} onPress={handleUpdateCategory} disabled={updateCategory.isPending}>
          {updateCategory.isPending ? <ActivityIndicator size="small" color="#fff" /> : <Text style={localStyles.saveBtnText}>Guardar cambios</Text>}
        </TouchableOpacity>
      </BottomSheetScrollView>
    );
  };

  if (mode === "subcategories" && selectedCategory) {
    return (
      <View style={{ flex: 1 }}>
        <View style={localStyles.headerRow}>
          <TouchableOpacity onPress={() => { setSelectedCategory(null); setMode("list"); }}>
            <Text style={{ color: colors.primary, fontSize: 16 }}>Atrás</Text>
          </TouchableOpacity>
          <Text style={localStyles.title}>{selectedCategory.name}</Text>
          <TouchableOpacity onPress={() => { resetSubcategoryForm(); setMode("create-subcategory"); }}>
            <Plus size={22} color={colors.primary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <BottomSheetFlatList
          data={selectedCategory.subcategories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const SubIcon = getIconByKey(item.icon);
            return (
              <View style={localStyles.subItem}>
                <View style={[localStyles.subIconBox, { backgroundColor: selectedCategory?.color || colors.primary }]}>
                  <SubIcon size={14} color="#fff" strokeWidth={2} />
                </View>
                <Text style={localStyles.itemNameFlex}>{item.name}</Text>
                {!item.isSystem && (
                  <View style={localStyles.actions}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedSubcategory(item);
                        setSubName(item.name);
                        setSubIcon(item.icon ?? "");
                        setMode("edit-subcategory");
                      }}
                      style={localStyles.iconBtn}
                    >
                      <Pencil size={16} color={colors.textTertiary} strokeWidth={1.8} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteSubcategory(item)} style={localStyles.iconBtn}>
                      <Trash2 size={16} color={colors.danger} strokeWidth={1.8} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          }}
          contentContainerStyle={localStyles.list}
          ListEmptyComponent={<Text style={localStyles.empty}>Sin subcategorías</Text>}
        />
      </View>
    );
  };

  if (mode === "create-subcategory" && selectedCategory) {
    const PreviewSubIcon = subIcon ? getIconByKey(subIcon) : ShoppingCart;

    return (
      <BottomSheetScrollView contentContainerStyle={localStyles.form}>
          <View style={[localStyles.headerRow, localStyles.headerRowInForm]}>
            <Text style={localStyles.title}>Nueva subcategoría</Text>
          <TouchableOpacity onPress={() => setMode("subcategories")}>
            <X size={20} color={colors.textTertiary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <Text style={localStyles.label}>Nombre</Text>
        <BottomSheetTextInput style={localStyles.input} placeholder="Ej. Almuerzo" placeholderTextColor={colors.textTertiary} value={subName} onChangeText={setSubName} maxLength={100} />

        <Text style={localStyles.label}>Icono</Text>
        <TouchableOpacity style={localStyles.pickerTrigger} onPress={() => setMode("pick-sub-icon")}>
          <View style={[localStyles.triggerIconPreview, { backgroundColor: selectedCategory.color || colors.primaryLight }]}>
            <PreviewSubIcon size={18} color="#fff" strokeWidth={1.8} />
          </View>
          <Text style={[localStyles.triggerText, !subIcon && localStyles.triggerPlaceholder]}>
            {ICON_CATALOG.find((i) => i.key === subIcon)?.label || "Seleccionar icono"}
          </Text>
          <ChevronRight size={16} color={colors.textTertiary} strokeWidth={1.8} />
        </TouchableOpacity>

        <TouchableOpacity style={localStyles.saveBtn} onPress={handleCreateSubcategory} disabled={createSubcategory.isPending}>
          {createSubcategory.isPending ? <ActivityIndicator size="small" color="#fff" /> : <Text style={localStyles.saveBtnText}>Crear subcategoría</Text>}
        </TouchableOpacity>
      </BottomSheetScrollView>
    );
  };

  if (mode === "edit-subcategory" && selectedSubcategory) {
    const PreviewSubIcon = subIcon ? getIconByKey(subIcon) : ShoppingCart;

    return (
      <BottomSheetScrollView contentContainerStyle={localStyles.form}>
          <View style={[localStyles.headerRow, localStyles.headerRowInForm]}>
            <Text style={localStyles.title}>Editar subcategoría</Text>
          <TouchableOpacity onPress={() => setMode("subcategories")}>
            <X size={20} color={colors.textTertiary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <Text style={localStyles.label}>Nombre</Text>
        <BottomSheetTextInput style={localStyles.input} value={subName} onChangeText={setSubName} maxLength={100} />

        <Text style={localStyles.label}>Icono</Text>
        <TouchableOpacity style={localStyles.pickerTrigger} onPress={() => setMode("pick-sub-icon")}>
          <View style={[localStyles.triggerIconPreview, { backgroundColor: selectedCategory?.color || colors.primaryLight }]}>
            <PreviewSubIcon size={18} color="#fff" strokeWidth={1.8} />
          </View>
          <Text style={[localStyles.triggerText, !subIcon && localStyles.triggerPlaceholder]}>
            {ICON_CATALOG.find((i) => i.key === subIcon)?.label || "Seleccionar icono"}
          </Text>
          <ChevronRight size={16} color={colors.textTertiary} strokeWidth={1.8} />
        </TouchableOpacity>

        <TouchableOpacity style={localStyles.saveBtn} onPress={handleUpdateSubcategory} disabled={updateSubcategory.isPending}>
          {updateSubcategory.isPending ? <ActivityIndicator size="small" color="#fff" /> : <Text style={localStyles.saveBtnText}>Guardar cambios</Text>}
        </TouchableOpacity>
      </BottomSheetScrollView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={localStyles.headerRow}>
        <Text style={localStyles.title}>Categorías</Text>
        <TouchableOpacity onPress={() => { resetCategoryForm(); setMode("create-category"); }}>
          <Text style={{ color: colors.primary, fontSize: 16 }}>Agregar</Text>
        </TouchableOpacity>
      </View>
      <BottomSheetFlatList
        data={categories ?? []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCategoryItem}
        contentContainerStyle={localStyles.list}
        ListEmptyComponent={<Text style={localStyles.empty}>No hay categorías</Text>}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 12
  },
  headerRowInForm: {
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 20
  },
  empty: {
    textAlign: "center",
    marginTop: 24,
    color: colors.textSecondary,
    fontSize: 14
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: 10
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6
  },
  itemInfo: {
    flex: 1
  },
  itemName: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "500"
  },
  itemNameFlex: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "500"
  },
  itemBadge: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2
  },
  subCount: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "600"
  },
  subItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: 10
  },
  subIconBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  actions: {
    flexDirection: "row",
    gap: 4
  },
  iconBtn: {
    padding: 6
  },
  form: {
    paddingHorizontal: 24,
    paddingBottom: 32
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    marginTop: 16,
    marginBottom: 8
  },
  input: {
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: colors.bg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  typeRow: {
    flexDirection: "row",
    gap: 10
  },
  typePill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border
  },
  typePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  typePillText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary
  },
  typePillTextActive: {
    color: "#fff"
  },
  saveBtn: {
    marginTop: 28,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center"
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff"
  },
  pickerTrigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  triggerIconPreview: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  triggerColorPreview: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  triggerText: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  triggerPlaceholder: {
    color: colors.textTertiary,
  },
  pickerGridContent: {
    paddingBottom: 24,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 12,
    gap: 8,
  },
  pickerItem: {
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 14,
    width: "22%",
    marginBottom: 4,
  },
  pickerItemSelected: {
    backgroundColor: colors.primary,
  },
  pickerLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: "500",
    textAlign: "center",
  },
  pickerLabelSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  colorSwatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorSwatchSelected: {
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
