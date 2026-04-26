import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { defaultStaticData, type StaticCategory, type StaticItem } from "@/mocks/staticData";

export function useStaticData() {
  const [categories, setCategories] = useState<StaticCategory[]>(defaultStaticData);
  const [isLoading, setIsLoading] = useState(true);

  // تحميل البيانات من Supabase
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("static_data")
          .select("*")
          .order("category_key");

        if (error) throw error;

        if (data && data.length > 0 && mounted) {
          const cats: StaticCategory[] = data.map((row) => ({
            key: row.category_key,
            title: row.category_title,
            icon: row.category_icon ?? "",
            description: row.category_description ?? "",
            color: row.category_color ?? "",
            items: (row.items as StaticItem[]) ?? [],
          }));
          setCategories(cats);
        } else if (mounted) {
          // أول تشغيل — نزرع البيانات الافتراضية
          await seedDefaultData();
        }
      } catch {
        // fallback
        if (mounted) setCategories(defaultStaticData);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, []);

  const seedDefaultData = async () => {
    try {
      const rows = defaultStaticData.map((cat) => ({
        category_key: cat.key,
        category_title: cat.title,
        category_icon: cat.icon,
        category_description: cat.description,
        category_color: cat.color,
        items: cat.items,
      }));
      const { error } = await supabase.from("static_data").insert(rows);
      if (!error) setCategories(defaultStaticData);
    } catch {
      setCategories(defaultStaticData);
    }
  };

  const persistCategory = useCallback(async (updated: StaticCategory) => {
    setCategories((prev) => prev.map((c) => (c.key === updated.key ? updated : c)));
    try {
      await supabase
        .from("static_data")
        .update({ items: updated.items })
        .eq("category_key", updated.key);
    } catch {
      // ignore
    }
  }, []);

  const addItem = useCallback(async (categoryKey: string, label: string) => {
    setCategories((prev) => {
      const updated = prev.map((cat) => {
        if (cat.key !== categoryKey) return cat;
        const maxOrder = cat.items.reduce((m, i) => Math.max(m, i.order), 0);
        const newItem: StaticItem = {
          id: `${categoryKey}_${Date.now()}`,
          label: label.trim(),
          active: true,
          order: maxOrder + 1,
        };
        const newCat = { ...cat, items: [...cat.items, newItem] };
        // persist async
        supabase
          .from("static_data")
          .update({ items: newCat.items })
          .eq("category_key", categoryKey)
          .then(() => {});
        return newCat;
      });
      return updated;
    });
  }, []);

  const toggleItem = useCallback(async (categoryKey: string, itemId: string) => {
    setCategories((prev) => {
      const updated = prev.map((cat) => {
        if (cat.key !== categoryKey) return cat;
        const newCat = {
          ...cat,
          items: cat.items.map((item) =>
            item.id === itemId ? { ...item, active: !item.active } : item
          ),
        };
        supabase
          .from("static_data")
          .update({ items: newCat.items })
          .eq("category_key", categoryKey)
          .then(() => {});
        return newCat;
      });
      return updated;
    });
  }, []);

  const editItem = useCallback(async (categoryKey: string, itemId: string, newLabel: string) => {
    setCategories((prev) => {
      const updated = prev.map((cat) => {
        if (cat.key !== categoryKey) return cat;
        const newCat = {
          ...cat,
          items: cat.items.map((item) =>
            item.id === itemId ? { ...item, label: newLabel.trim() } : item
          ),
        };
        supabase
          .from("static_data")
          .update({ items: newCat.items })
          .eq("category_key", categoryKey)
          .then(() => {});
        return newCat;
      });
      return updated;
    });
  }, []);

  const deleteItem = useCallback(async (categoryKey: string, itemId: string) => {
    setCategories((prev) => {
      const updated = prev.map((cat) => {
        if (cat.key !== categoryKey) return cat;
        const newCat = { ...cat, items: cat.items.filter((item) => item.id !== itemId) };
        supabase
          .from("static_data")
          .update({ items: newCat.items })
          .eq("category_key", categoryKey)
          .then(() => {});
        return newCat;
      });
      return updated;
    });
  }, []);

  const resetCategory = useCallback(async (categoryKey: string) => {
    const defaultCat = defaultStaticData.find((c) => c.key === categoryKey);
    if (!defaultCat) return;
    setCategories((prev) => prev.map((c) => (c.key === categoryKey ? { ...defaultCat } : c)));
    try {
      await supabase
        .from("static_data")
        .update({ items: defaultCat.items })
        .eq("category_key", categoryKey);
    } catch {
      // ignore
    }
  }, []);

  const getActiveItems = useCallback(
    (categoryKey: string): string[] => {
      const cat = categories.find((c) => c.key === categoryKey);
      if (!cat) return [];
      return cat.items
        .filter((i) => i.active)
        .sort((a, b) => a.order - b.order)
        .map((i) => i.label);
    },
    [categories]
  );

  return {
    categories,
    isLoading,
    addItem,
    toggleItem,
    editItem,
    deleteItem,
    resetCategory,
    getActiveItems,
    persist: persistCategory,
  };
}
